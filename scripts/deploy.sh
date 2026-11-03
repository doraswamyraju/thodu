#!/usr/bin/env bash
# Thodu Live VPS Deployment Script (Port 5089 / thodu.sriddha.com)
# Hostinger VPS IP: 147.93.107.21

set -e

echo "=== [1/4] Preparing Production Deployment for Thodu ==="
APP_DIR="/var/www/thodu"
PORT=5089

echo "=== [2/4] Pulling Latest Source from GitHub ==="
if [ ! -d "$APP_DIR" ]; then
  git clone https://github.com/doraswamyraju/thodu.git "$APP_DIR"
else
  cd "$APP_DIR"
  git pull origin main
fi

cd "$APP_DIR"

echo "=== [3/4] Installing & Building API and Web App ==="
cd "$APP_DIR/services/api"
npm install --production=false
npm run build

cd "$APP_DIR/apps/web"
npm install
npm run build

echo "=== [4/4] Starting / Reloading PM2 Service on Port 5089 ==="
cd "$APP_DIR/services/api"
if command -v pm2 &> /dev/null; then
  pm2 delete thodu-api 2>/dev/null || true
  PORT=5089 pm2 start dist/index.js --name "thodu-api"
  pm2 save
else
  echo "PM2 not found, running background node process on port 5089..."
  PORT=5089 nohup node dist/index.js > /var/log/thodu-api.log 2>&1 &
fi

echo "=== Thodu Deployed Successfully on Port 5089! ==="
