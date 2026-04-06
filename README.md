# Deploy Frontend SPA dengan Cloudflare + Nginx (tanpa HAProxy)

Panduan ringkas untuk server Ubuntu “kosongan” dengan Cloudflare (SSL di Cloudflare) dan Nginx sebagai static server + proxy ke backend.

## Prasyarat
- Ubuntu server dengan akses SSH
- Domain di Cloudflare (DNS proxy aktif/awan oranye)
- Backend tersedia di `https://backend.horizonberita.com`

## Install Paket Dasar
```
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ca-certificates ufw nginx
```

## Node.js (untuk build di server, atau gunakan CI/CD)
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

## Clone & Build
```
cd /var/www
sudo git clone https://github.com/<org>/<repo>.git frontend-spa
cd frontend-spa

# Konfigurasi .env produksi
# Pastikan semua URL dari .env (tanpa hardcode)
# Contoh:
# VITE_FRONTEND_URL=https://frontend.horizonberita.com
# VITE_BACKEND_URL=https://backend.horizonberita.com
# VITE_API_URL=https://backend.horizonberita.com/api

npm ci
npm run build
sudo mkdir -p /var/www/frontend-spa/dist
sudo rsync -a --delete dist/ /var/www/frontend-spa/dist/
sudo chown -R www-data:www-data /var/www/frontend-spa/dist
```

## Nginx (SPA + Proxy ke Backend)
Buat file `/etc/nginx/sites-available/frontend.conf`:
```
server {
  listen 80;
  server_name frontend.horizonberita.com;

  root /var/www/frontend-spa/dist;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Static assets: cache + rate limiting (mitigasi mass download)
  limit_req_zone $binary_remote_addr zone=req_zone:10m rate=10r/s;
  limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf)$ {
    access_log off;
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
    limit_req zone=req_zone burst=20 nodelay;
    limit_conn conn_zone 10;
  }

  # Blokir user-agent scraping umum
  map $http_user_agent $bad_ua {
    default 0;
    "~*curl|wget|python-requests|httpclient|scrapy|bot|spider|scan|masscan|dirbuster|nmap" 1;
  }
  if ($bad_ua) { return 403; }

  # Header keamanan
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # CSP sesuaikan kebutuhan Web/APK
  add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: blob: https://frontend.horizonberita.com https://backend.horizonberita.com; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://backend.horizonberita.com; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" always;

  # Proxy ke backend (sesuaikan path)
  location ^~ /api/ {
    proxy_pass https://backend.horizonberita.com/api/;
    proxy_set_header Host backend.horizonberita.com;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  location ^~ /logout {
    proxy_pass https://backend.horizonberita.com/logout;
    proxy_set_header Host backend.horizonberita.com;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  location ^~ /media/ {
    proxy_pass https://backend.horizonberita.com/media/;
    proxy_set_header Host backend.horizonberita.com;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
Aktifkan site dan reload:
```
sudo ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/frontend.conf
sudo nginx -t && sudo systemctl reload nginx
```

## Cloudflare
- DNS: arahkan `frontend.horizonberita.com` ke IP server (proxy ON)
- SSL: gunakan Flexible (cukup HTTP di origin) atau disarankan Full (Strict) dengan Origin Cert
- WAF/Firewall: aktifkan Bot Fight Mode, blokir UA otomatis, rate limiting untuk static assets

## Android APK (Capacitor)
Build di repo ini, lalu sinkron ke Android dan kompilasi:
```
npm run build
npx cap copy android
# Di Windows
cd android && .\gradlew.bat assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

## Catatan Anti Mass-Download
- Rate limiting & limit connection di Nginx + Cloudflare
- Blokir user-agent umum otomasi
- Hindari directory listing; layani media sensitif via backend dengan kontrol akses

## Troubleshooting
- `tail -f /var/log/nginx/access.log /var/log/nginx/error.log`
- Verifikasi CSP dan proxy rute `/api`, `/media`, `/logout`


- Jalankan build: npm run build
- Sinkronkan hasil build ke server: sudo rsync -av --delete dist/ /var/www/frontend-spa/dist/