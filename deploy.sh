#!/bin/bash

# Exit on any error
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    log "Please run as root"
    exit 1
fi

# Check required environment variables
if [ -z "$OPENAI_API_KEY" ] || [ -z "$JWT_SECRET" ] || [ -z "$ADMIN_PASSWORD" ]; then
    log "Error: Required environment variables not set"
    log "Please set: OPENAI_API_KEY, JWT_SECRET, ADMIN_PASSWORD"
    exit 1
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
    python3-certbot-nginx

# Start and enable Docker
log "Configuring Docker..."
systemctl start docker
systemctl enable docker

# Set up SSL certificate
log "Setting up SSL certificate..."
certbot certonly --standalone \
    -d matt-hulme.com \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com \
    --http-01-port=80

# Create app directory
log "Setting up application directory..."
mkdir -p /opt/brainstormer
cd /opt/brainstormer

# Stop existing containers
if [ -f "docker-compose.yml" ]; then
    log "Stopping existing containers..."
    docker-compose down
fi

# Pull latest changes
if [ -d ".git" ]; then
    log "Updating from git..."
    git pull
else
    log "Cloning repository..."
    git clone https://github.com/yourusername/brainstormer.git .
fi

# Set up environment variables
log "Configuring environment variables..."
cat > .env << EOL
OPENAI_API_KEY=${OPENAI_API_KEY}
JWT_SECRET=${JWT_SECRET}
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOL

# Build and start containers
log "Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Verify deployment
log "Verifying deployment..."
sleep 10  # Wait for containers to fully start

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    log "Error: Containers failed to start"
    docker-compose logs
    exit 1
fi

# Test backend health endpoint
if ! curl -f -s "http://localhost:8000/health" > /dev/null; then
    log "Error: Backend health check failed"
    docker-compose logs backend
    exit 1
fi

log "Deployment completed successfully!"
log "You can now access the application at https://matt-hulme.com"
log "Use 'docker-compose logs -f' to view the logs" 