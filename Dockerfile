# Multi-stage production build for PharmaPrint Unified Service
FROM python:3.11-slim

WORKDIR /app

# 1. Install Node.js 20, Tesseract OCR, OpenCV runtime dependencies, and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Python dependencies
COPY ai-service/requirements.txt ./ai-service/
RUN pip install --no-cache-dir -r ./ai-service/requirements.txt

# 3. Build React Frontend
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# 4. Install Node.js Backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/

# 5. Copy AI Service code
COPY ai-service/ ./ai-service/

# 6. Environment configuration
ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

CMD ["node", "server/server.js"]
