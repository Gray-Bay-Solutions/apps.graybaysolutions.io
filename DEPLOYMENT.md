# Deployment Guide - Linode Server

This guide will help you deploy the Graybay Monitoring application to your Linode server running MySQL and Nginx.

## Prerequisites

Your Linode server should have:
- ✅ MySQL database running
- ✅ Nginx web server running
- ✅ Node.js (v18 or higher)
- ✅ npm or yarn
- ✅ PM2 (recommended for process management)

## Step 1: Server Preparation

### Install Node.js (if not already installed)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2 (recommended)
```bash
sudo npm install -g pm2
```

### Create application directory
```bash
sudo mkdir -p /var/www/graybay-monitoring
sudo chown $USER:$USER /var/www/graybay-monitoring
```

## Step 2: Database Setup

### Create database and user
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE graybay_monitoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'gray'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON graybay_monitoring.* TO 'gray'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Deploy Application

### Upload your code to the server
```bash
# Option 1: Using Git (recommended)
cd /var/www/graybay-monitoring
git clone https://github.com/yourusername/graybay-monitoring.git .

# Option 2: Using SCP/SFTP
# Upload your project files to /var/www/graybay-monitoring
```

### Create environment file
```bash
cd /var/www/graybay-monitoring
nano .env.production
```

Add the following content:
```env
# Database Configuration
DATABASE_URL="mysql://graybay_user:your_secure_password@localhost:3306/graybay_monitoring"

# NextAuth Configuration
NEXTAUTH_URL="https://apps.graybaysolutions.io"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-here-generate-a-random-32-char-string"

# Application Configuration
NODE_ENV="production"
PORT=4000

# Optional: Additional MySQL settings
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_DATABASE="graybay_monitoring"
MYSQL_USER="graybay_user"
MYSQL_PASSWORD="your_secure_password"
```

### Make deployment script executable and run it
```bash
chmod +x deploy.sh
npm run deploy
```

## Step 4: Configure Nginx

### Create Nginx site configuration
```bash
sudo nano /etc/nginx/sites-available/graybay-monitoring
```

Copy the content from `nginx-site.conf` and update:
- Domain is already set to `apps.graybaysolutions.io`
- Ensure the proxy_pass points to `http://localhost:4000`

### Enable the site
```bash
# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/graybay-monitoring /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 5: SSL Setup (Required for Production)

### Install Certbot (if not already installed)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Obtain SSL certificate for apps.graybaysolutions.io
```bash
sudo certbot --nginx -d apps.graybaysolutions.io
```

### Update Nginx configuration
After SSL setup, uncomment the HTTPS server block in your Nginx configuration and update the HTTP block to redirect to HTTPS.

## Step 6: Process Management with PM2

### Start the application
```bash
cd /var/www/graybay-monitoring
pm2 start ecosystem.config.js --env production
```

### Save PM2 configuration
```bash
pm2 save
pm2 startup
```

### Monitor your application
```bash
# View application logs
pm2 logs graybay-monitoring

# Check application status
pm2 status

# Restart application
pm2 restart graybay-monitoring

# Stop application
pm2 stop graybay-monitoring
```

## Step 7: DNS Configuration (On Your End)

Make sure your DNS is configured to point `apps.graybaysolutions.io` to your Linode server:

### Add DNS A Record
In your domain registrar's DNS settings (or DNS provider):
```
Type: A
Name: apps
Value: [Your Linode Server IP Address]
TTL: 300 (or default)
```

This will make `apps.graybaysolutions.io` point to your server.

## Step 8: Firewall Configuration

Ensure your firewall allows the necessary ports:
```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Or allow specific ports
sudo ufw allow 80
sudo ufw allow 443

# Port 4000 should only be accessible locally (for Nginx proxy)
# Don't expose it directly to the internet
```

## Step 9: Health Check

### Test your deployment
```bash
# Check if the application is running on port 4000
curl http://localhost:4000

# Check through Nginx (after DNS propagation)
curl http://apps.graybaysolutions.io

# Check SSL (after SSL setup)
curl https://apps.graybaysolutions.io
```

## Troubleshooting

### Common Issues

1. **Application not starting:**
   ```bash
   # Check PM2 logs
   pm2 logs graybay-monitoring
   
   # Check if port 4000 is in use
   netstat -tlnp | grep :4000
   ```

2. **Database connection issues:**
   ```bash
   # Test database connection
   mysql -u gray -p -h localhost graybay_monitoring
   
   # Check Prisma connection
   cd /var/www/graybay-monitoring
   npx prisma db push
   ```

3. **Nginx proxy issues:**
   ```bash
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   
   # Test Nginx configuration
   sudo nginx -t
   ```

4. **DNS issues:**
   ```bash
   # Check if DNS is resolving correctly
   nslookup apps.graybaysolutions.io
   
   # Test from your local machine
   ping apps.graybaysolutions.io
   ```

### Useful Commands

```bash
# View application logs
pm2 logs graybay-monitoring --lines 100

# Monitor real-time logs
pm2 logs graybay-monitoring --follow

# Restart after code changes
pm2 restart graybay-monitoring

# View application metrics
pm2 monit

# Update application (after code changes)
cd /var/www/graybay-monitoring
git pull
npm ci
npm run build
pm2 restart graybay-monitoring
```

## Security Best Practices

1. **Environment Variables:** Never commit `.env` files to version control
2. **Database Security:** Use strong passwords and restrict database access
3. **Firewall:** Only expose necessary ports (80, 443)
4. **SSL:** Always use HTTPS in production
5. **Updates:** Keep your system and dependencies updated
6. **Backups:** Regular database backups
7. **Monitoring:** Set up monitoring and alerting

## Maintenance

### Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
cd /var/www/graybay-monitoring
npm audit fix
npm update

# Rebuild and restart
npm run build
pm2 restart graybay-monitoring
```

### Database Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup-graybay.sh

# Add backup commands
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u gray -p password graybay_monitoring > /backups/graybay_$DATE.sql

# Make executable and add to cron
chmod +x /usr/local/bin/backup-graybay.sh
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-graybay.sh
```

---

🎉 **Your Graybay Monitoring application should now be live at https://apps.graybaysolutions.io!**

Visit your domain to access the application. If you encounter any issues, check the troubleshooting section above. 