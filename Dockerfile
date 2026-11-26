# -------------------------------------------------------------------
# Stage 1: Build Frontend (React + Vite)
# -------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# -------------------------------------------------------------------
# Stage 2: Unified Production Container (Node.js 20 + Python 3.11 AI)
# -------------------------------------------------------------------
FROM node:20-slim

WORKDIR /app

# Install standard Python 3 and Tesseract OCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Create and activate Python virtual environment
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install lightweight CPU PyTorch & Torchvision
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install Python requirements
COPY ai-service/requirements.txt ./ai-service/
RUN pip install --no-cache-dir -r ./ai-service/requirements.txt

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/client/dist ./client/dist

# Install Node.js backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy backend & AI service code
COPY server/ ./server/
COPY ai-service/ ./ai-service/

ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

CMD ["node", "server/server.js"]
