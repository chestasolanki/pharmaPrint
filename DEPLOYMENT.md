# PharmaPrint Deployment Guide

This guide covers 3 production deployment options for PharmaPrint:
1. **Option 1 (Recommended):** Hybrid Cloud Deployment (Frontend on Vercel + Backend & AI on Render/Railway)
2. **Option 2:** All-in-One Cloud VPS with Docker Compose (AWS EC2 / DigitalOcean / Linode / GCP)
3. **Option 3:** Quick Public Tunnel for College Viva / Live Demo (ngrok or Cloudflare Tunnel)

---

## Architecture Overview
- **Frontend:** React + Vite + Tailwind CSS (`/client`) -> Built into `/client/dist`
- **Backend API:** Node.js + Express (`/server`) -> Runs on port `5001`
- **AI Microservice:** Python 3.11 + PyTorch + OpenCV + Tesseract OCR + FAISS (`/ai-service`) -> Runs on port `8000` or via direct CLI

---

## Option 1: Hybrid Cloud (Vercel + Render) - Easiest & Most Reliable

### Step 1: Deploy Backend & AI Service to Render.com
1. Create a free account on [Render.com](https://render.com).
2. Push your project to GitHub.
3. In Render Dashboard, click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure:
   - **Environment:** Docker
   - **Dockerfile Path:** `./server/Dockerfile` (or `./ai-service/Dockerfile` if running microservice)
   - **Plan:** Free or Starter
6. Render will assign you a live backend URL, for example:
   `https://pharmaprint-backend.onrender.com`

---

### Step 2: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and import your repository.
3. Configure project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://pharmaprint-backend.onrender.com` (your backend URL from Step 1)
5. Click **Deploy**. Vercel will give you a live production URL:
   `https://pharmaprint.vercel.app`

---

## Option 2: All-in-One Docker Compose (AWS EC2 / DigitalOcean Droplet)

If you have a Linux VPS (Ubuntu 22.04 / 24.04):

### 1. Install Docker & Docker Compose on your server
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
sudo systemctl enable --now docker
```

### 2. Clone Repository
```bash
git clone https://github.com/your-username/PharmaPrint.git
cd PharmaPrint
```

### 3. Build & Run Containers
```bash
docker compose up -d --build
```
This starts:
- Frontend on `http://YOUR_SERVER_IP:3000`
- Express Backend on `http://YOUR_SERVER_IP:5001`
- Python AI Service on `http://YOUR_SERVER_IP:8000`

### 4. Setup Domain & Free SSL (Nginx + Certbot)
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Configure Nginx (`/etc/nginx/sites-available/pharmaprint`):
```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable site and generate SSL:
```bash
sudo ln -s /etc/nginx/sites-available/pharmaprint /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 3: Instant Public HTTPS Link for College Viva Demo (Zero Cost)

If you are presenting to your supervisor (Mr. Adityan Gupta) or external examiners and want to test directly from your smartphone camera without paying for a cloud server:

### 1. Start your local servers
In terminal 1 (Backend):
```bash
node server/server.js
```

In terminal 2 (Frontend):
```bash
cd client && npm run dev
```

### 2. Expose with Cloudflare Tunnel (Free, no account needed)
```bash
npx untun@latest tunnel http://localhost:3000
```
Or with ngrok:
```bash
ngrok http 3000
```

### 3. Open the generated HTTPS link on your phone
You will receive a public HTTPS link (e.g. `https://random-subdomain.trycloudflare.com`).
Open it on your smartphone camera, upload or scan a medicine package, and get real-time AI verification results live!
