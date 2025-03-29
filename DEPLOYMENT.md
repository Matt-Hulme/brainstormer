# Deployment Guide

## Prerequisites

- A VPS running Ubuntu 20.04 or later
- Domain name (matt-hulme.com) pointing to your VPS IP
- SSH access to your VPS
- Git repository with the application code

## Deployment Steps

1. **Prepare Your Environment Variables**
   Create a `.env` file locally with these variables:

   ```
   OPENAI_API_KEY=your_openai_key
   JWT_SECRET=your_secure_jwt_secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ```

2. **Set Up DNS**

   - Add an A record pointing `matt-hulme.com` to your VPS IP
   - Add a CNAME record for `www.matt-hulme.com` pointing to `matt-hulme.com`

3. **Deploy to VPS**

   ```bash
   # SSH into your VPS
   ssh your-username@your-vps-ip

   # Clone the repository
   git clone https://github.com/yourusername/brainstormer.git
   cd brainstormer

   # Make the deployment script executable
   chmod +x deploy.sh

   # Set your environment variables
   export OPENAI_API_KEY=your_openai_key
   export JWT_SECRET=your_secure_jwt_secret
   export ADMIN_PASSWORD=your_secure_password

   # Run the deployment script
   ./deploy.sh
   ```

4. **Verify Deployment**
   - Visit https://matt-hulme.com
   - You should see the login prompt
   - Use the admin credentials to log in
   - Test the API endpoints

## Maintenance

### Updating the Application

```bash
cd /opt/brainstormer
git pull
docker-compose down
docker-compose up -d
```

### Viewing Logs

```bash
docker-compose logs -f
```

### SSL Certificate Renewal

```bash
sudo certbot renew
```

## Troubleshooting

1. **If the site is not accessible:**

   - Check if the containers are running: `docker-compose ps`
   - Check Nginx logs: `docker-compose logs nginx`
   - Verify SSL certificates: `ls -l /etc/letsencrypt/live/matt-hulme.com/`

2. **If the API is not working:**

   - Check backend logs: `docker-compose logs backend`
   - Verify environment variables: `docker-compose exec backend env`

3. **If SSL certificate issues occur:**
   - Check certificate status: `sudo certbot certificates`
   - Renew certificates: `sudo certbot renew`
