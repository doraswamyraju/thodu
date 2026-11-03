# Thodu: VPS Deployment Guide (`thodu.sriddha.com` : Port 5089)

> **Safety Notice**: This deployment is strictly isolated within `/var/www/thodu`, uses port `5089`, and configures an independent Nginx server block (`/etc/nginx/sites-available/thodu.sriddha.com`). It **will not modify or interfere with any other domains or applications hosted on this VPS**.

---

## 1. First-Time Setup on Hostinger VPS

Open your Hostinger VPS Web Terminal (or SSH as `root@147.93.107.21`) and execute these commands:

### Step 1.1: Clone Repository to Isolated Directory
```bash
# Create dedicated directory and clone
mkdir -p /var/www/thodu
git clone https://github.com/doraswamyraju/thodu.git /var/www/thodu
cd /var/www/thodu
```

### Step 1.2: Install Dependencies & Build
```bash
# 1. Build Backend API
cd /var/www/thodu/services/api
npm install
npm run build

# 2. Build Web Application
cd /var/www/thodu/apps/web
npm install
npm run build
```

### Step 1.3: Start the Backend Service on Port 5089 with PM2
```bash
# Start backend using PM2 under isolated name 'thodu-api'
cd /var/www/thodu/services/api
PORT=5089 pm2 start dist/index.js --name "thodu-api"
pm2 save
```
> Verify it's running: `pm2 status thodu-api` or `curl http://localhost:5089/health`

---

## 2. Nginx Configuration for `thodu.sriddha.com`

To serve both the Web App and the API under domain `thodu.sriddha.com` without disturbing any existing websites on Nginx:

### Step 2.1: Create Isolated Nginx Site Config
```bash
cat << 'EOF' > /etc/nginx/sites-available/thodu.sriddha.com
server {
    listen 80;
    server_name thodu.sriddha.com;

    # Serve built React Web Application
    root /var/www/thodu/apps/web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Port 5089
    location /api/ {
        proxy_pass http://127.0.0.1:5089/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Proxy Direct Health Check to Port 5089
    location /health {
        proxy_pass http://127.0.0.1:5089/health;
    }
}
EOF
```

### Step 2.2: Enable Site and Reload Nginx Safely
```bash
# Symlink to sites-enabled
ln -sf /etc/nginx/sites-available/thodu.sriddha.com /etc/nginx/sites-enabled/

# Test Nginx syntax FIRST (ensures no existing sites are broken)
nginx -t

# If syntax is ok, reload safely without dropping active connections:
systemctl reload nginx
```

### Step 2.3: Free SSL Certificate Setup (Let's Encrypt / Certbot)

Run this command to issue and automatically configure HTTPS for `thodu.sriddha.com`:

```bash
# 1. Ensure certbot is installed
apt-get update && apt-get install -y certbot python3-certbot-nginx

# 2. Issue and attach SSL certificate directly to Nginx (Zero downtime for other domains)
certbot --nginx -d thodu.sriddha.com --non-interactive --agree-tos -m rajugariventures@gmail.com

# 3. Reload Nginx to apply HTTPS cleanly
systemctl reload nginx
```
> After this, `https://thodu.sriddha.com` will immediately have a valid green SSL padlock.

---

## 3. Future Fast Deployments (One-Liner Updates)

Whenever you push code updates, run this single line in your VPS terminal:

```bash
cd /var/www/thodu && git pull origin main && cd services/api && npm install && npm run build && pm2 restart thodu-api && cd ../../apps/web && npm install && npm run build && echo "=== Thodu Deployment Successful ==="
```

Or execute the included deployment script:
```bash
bash /var/www/thodu/scripts/deploy.sh
```

---

## 4. Verification & Diagnostics

1. Check PM2 status:
   ```bash
   pm2 logs thodu-api --lines 20
   ```
2. Test local port:
   ```bash
   curl http://localhost:5089/health
   ```
3. Open in browser:
   - `http://thodu.sriddha.com` or `https://thodu.sriddha.com`
   - `http://thodu.sriddha.com:5089/health`

