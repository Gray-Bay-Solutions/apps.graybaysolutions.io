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

-- Create user (replace with your preferred username/password)
CREATE USER 'gray'@'localhost' IDENTIFIED BY 'LouieLily4050';
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

Add the following content (replace with your actual values):
```env
# Database Configuration
DATABASE_URL="mysql://graybay_user:your_secure_password@localhost:3306/graybay_monitoring"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-here"

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
- Replace `your-domain.com` with your actual domain
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

## Step 5: SSL Setup (Optional but Recommended)

### Install Certbot
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Obtain SSL certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
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

## Step 7: Firewall Configuration

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

## Step 8: Health Check

### Test your deployment
```bash
# Check if the application is running on port 4000
curl http://localhost:4000

# Check through Nginx
curl http://your-domain.com

# Check SSL (if configured)
curl https://your-domain.com
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
   mysql -u graybay_user -p -h localhost graybay_monitoring
   
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
mysqldump -u graybay_user -p graybay_monitoring > /backups/graybay_$DATE.sql

# Make executable and add to cron
chmod +x /usr/local/bin/backup-graybay.sh
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-graybay.sh
```

---

🎉 **Your Graybay Monitoring application should now be live!**

Visit your domain to access the application. If you encounter any issues, check the troubleshooting section above. 