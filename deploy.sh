#!/bin/bash

# Exit on any error
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if running as root (we'll drop privileges later)
if [ "$EUID" -ne 0 ]; then 
    log "Please run as root (we'll create a non-root user for the app)"
    exit 1
fi

# Create non-privileged user for the application
log "Creating application user..."
if ! id "brainstormer" &>/dev/null; then
    useradd --system --shell /bin/false --home-dir /opt/brainstormer --create-home brainstormer
fi

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
    log "Loading environment variables from .env file..."
    set -a  # automatically export all variables
    source .env
    set +a  # turn off automatic export
else
    log "No .env file found. Checking for environment variables..."
fi

# Check required environment variables
if [ -z "$OPENAI_API_KEY" ] || [ -z "$JWT_SECRET" ] || [ -z "$GUEST_PASSWORD" ] || [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    log "Error: Required environment variables not set"
    log "Required variables: OPENAI_API_KEY, JWT_SECRET, GUEST_PASSWORD, SUPABASE_URL, SUPABASE_KEY"
    log "Either set them as environment variables or include them in a .env file"
    exit 1
fi

# Validate JWT_SECRET strength
if [ ${#JWT_SECRET} -lt 32 ]; then
    log "Warning: JWT_SECRET should be at least 32 characters for security"
fi

# Update system
log "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
log "Installing required packages..."
apt-get install -y \
    docker.io \
    docker-compose \
    certbot \
    python3-certbot-nginx \
    apache2-utils \
    fail2ban \
    ufw

# Configure firewall
log "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Configure fail2ban for additional protection
log "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOL'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
EOL

systemctl enable fail2ban
systemctl restart fail2ban

# Start and enable Docker
log "Configuring Docker..."
systemctl start docker
systemctl enable docker

# Add brainstormer user to docker group
usermod -aG docker brainstormer

# Set up SSL certificate
log "Setting up SSL certificate..."
certbot certonly --standalone \
    -d matt-hulme.com \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com \
    --http-01-port=80

# Create app directory with proper ownership
log "Setting up application directory..."
mkdir -p /opt/brainstormer
cd /opt/brainstormer

# Copy files and set ownership
chown -R brainstormer:brainstormer /opt/brainstormer

# Stop existing containers
if [ -f "docker-compose.yml" ]; then
    log "Stopping existing containers..."
    sudo -u brainstormer docker-compose down
fi

# Set up environment variables with secure permissions
log "Configuring environment variables..."
sudo -u brainstormer cat > .env << EOL
# Backend Configuration
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_KEY=${SUPABASE_KEY}
OPENAI_API_KEY=${OPENAI_API_KEY}
JWT_SECRET=${JWT_SECRET}
GUEST_USERNAME=guest
GUEST_PASSWORD=${GUEST_PASSWORD}
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DEBUG=False

# Frontend Configuration
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_KEY}
VITE_API_BASE_URL=https://matt-hulme.com/api

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
EOL

# Secure the .env file
chmod 600 .env
chown brainstormer:brainstormer .env

# Create .htpasswd file for basic auth with secure permissions
log "Setting up basic authentication..."
mkdir -p docker
echo -n "guest:" > docker/.htpasswd
echo "${GUEST_PASSWORD}" | openssl passwd -apr1 -stdin >> docker/.htpasswd
chmod 600 docker/.htpasswd
chown brainstormer:brainstormer docker/.htpasswd

# Build and start containers as non-root user
log "Building and starting containers..."
sudo -u brainstormer docker-compose build --no-cache
sudo -u brainstormer docker-compose up -d

# Set up automatic SSL renewal with proper permissions
log "Setting up SSL certificate renewal..."
cat > /etc/cron.d/letsencrypt << 'EOL'
0 12 * * * root /usr/bin/certbot renew --quiet && cd /opt/brainstormer && sudo -u brainstormer docker-compose restart frontend
EOL

# Set up log rotation for containers
log "Setting up log rotation..."
cat > /etc/logrotate.d/docker-containers << 'EOL'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOL

# Verify deployment
log "Verifying deployment..."
sleep 15  # Wait for containers to fully start

# Check if services are running
if ! sudo -u brainstormer docker-compose ps | grep -q "Up"; then
    log "Error: Containers failed to start"
    sudo -u brainstormer docker-compose logs
    exit 1
fi

# Test backend health endpoint
if ! curl -f -s "http://localhost:8000/health" > /dev/null; then
    log "Warning: Backend health check failed, checking logs..."
    sudo -u brainstormer docker-compose logs backend | tail -20
fi

# Final security hardening
log "Applying final security hardening..."

# Remove unnecessary packages
apt-get autoremove -y

# Set proper permissions on docker socket
chmod 660 /var/run/docker.sock

log "🔒 Secure deployment completed successfully!"
log "✅ Application running as non-root user 'brainstormer'"
log "✅ Firewall configured with minimal ports"
log "✅ Fail2ban protection enabled"
log "✅ Secure file permissions applied"
log "✅ SSL certificates configured"
log ""
log "🌐 Access your app at: https://matt-hulme.com"
log "👤 Username: guest"
log "🔑 Password: (your GUEST_PASSWORD)"
log ""
log "📊 Monitor with:"
log "  sudo -u brainstormer docker-compose logs -f"
log "  sudo -u brainstormer docker-compose ps" 