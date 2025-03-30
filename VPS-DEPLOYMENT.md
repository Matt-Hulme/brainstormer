# VPS Deployment Guide

This guide outlines the steps to deploy Brainstormer to a VPS using Docker.

## Prerequisites

- A VPS running Linux (Ubuntu recommended)
- Domain name (matt-hulme.com) with DNS pointing to your VPS
- Docker and Docker Compose installed on your VPS
- Basic knowledge of SSH and Linux commands

## Step 1: Prepare Your VPS

1. SSH into your VPS:

   ```bash
   ssh user@your-vps-ip
   ```

2. Update packages:

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. Install Docker and Docker Compose if not already installed:

   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER

   # Install Docker Compose
   sudo apt install docker-compose -y
   ```

4. Create a deployment directory:
   ```bash
   mkdir -p ~/brainstormer
   cd ~/brainstormer
   ```

## Step 2: Setup SSL with Let's Encrypt

1. Install Certbot:

   ```bash
   sudo apt install certbot -y
   ```

2. Generate SSL certificates:

   ```bash
   sudo certbot certonly --standalone -d matt-hulme.com -d www.matt-hulme.com
   ```

3. Verify certificates were created:
   ```bash
   sudo ls -la /etc/letsencrypt/live/matt-hulme.com/
   ```

## Step 3: Upload Your Code

1. From your local machine, upload the project files:

   ```bash
   rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' ./ user@your-vps-ip:~/brainstormer/
   ```

2. Create a `.env` file on the VPS:

   ```bash
   nano ~/brainstormer/.env
   ```

   Add your environment variables (copy from your local .env file, but update any production-specific values).

## Step 4: Create Basic Auth Credentials

1. Install Apache utilities for htpasswd:

   ```bash
   sudo apt install apache2-utils -y
   ```

2. Generate .htpasswd file:
   ```bash
   htpasswd -c ~/brainstormer/docker/.htpasswd admin
   ```
   Enter your desired password when prompted.

## Step 5: Deploy with Docker Compose

1. Start the containers:

   ```bash
   cd ~/brainstormer
   docker-compose up -d --build
   ```

2. Verify the containers are running:

   ```bash
   docker ps
   ```

3. Check the logs if needed:
   ```bash
   docker-compose logs -f
   ```

## Step 6: Setup Automatic SSL Renewal

1. Create a script to renew certificates and restart Docker:

   ```bash
   nano ~/renew-certs.sh
   ```

2. Add the following content:

   ```bash
   #!/bin/bash
   sudo certbot renew --quiet
   cd ~/brainstormer
   docker-compose restart frontend
   ```

3. Make it executable:

   ```bash
   chmod +x ~/renew-certs.sh
   ```

4. Add a cron job to run it monthly:
   ```bash
   (crontab -l ; echo "0 0 1 * * ~/renew-certs.sh") | crontab -
   ```

## Troubleshooting

- Check container logs: `docker-compose logs`
- Check nginx logs: `docker-compose logs frontend`
- Check backend logs: `docker-compose logs backend`

## Maintenance Commands

- Restart services: `docker-compose restart`
- Stop services: `docker-compose down`
- Update and rebuild: `docker-compose up -d --build`
- View logs: `docker-compose logs -f`

## Accessing Your Application

Your application should now be accessible at:

- https://matt-hulme.com

You'll be prompted for the basic auth credentials you created in Step 4.
