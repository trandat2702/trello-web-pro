# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve static files
FROM node:18-alpine
WORKDIR /app

# Khai bao gia tri mac dinh cho runtime (neu docker-compose khong truyen vao)
ENV VITE_API_ROOT=http://localhost:8017
ENV VITE_GOOGLE_CLIENT_ID=339787734370-al58slqdejnv5r8j41p9r54dsmc3vq9f.apps.googleusercontent.com

# Cài serve để chạy static files
RUN npm install -g serve

# Security: non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy build output va cap quyen cho user nodejs
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist


USER nodejs

EXPOSE 5173
# Tao file config.js tu bien moi truong, sau do start serve
CMD ["/bin/sh", "-c", "echo \"window.env = { VITE_API_ROOT: '${VITE_API_ROOT}', VITE_GOOGLE_CLIENT_ID: '${VITE_GOOGLE_CLIENT_ID}' };\" > /app/dist/config.js && serve -s dist -l 5173"]
