#!/bin/bash

set -e

echo "=== Building backend ==="
cd backend && npm run build && cd ..

echo "=== Building frontend ==="
cd frontend && npm run build && cd ..

echo "=== Building Docker images (amd64) ==="
docker buildx build --platform linux/amd64 -f frontend/Dockerfile -t liuxy0551/bilibili-mp3-frontend ./frontend
docker buildx build --platform linux/amd64 -f backend/Dockerfile -t liuxy0551/bilibili-mp3-backend ./backend

echo "=== Pushing to Aliyun registry ==="
docker tag liuxy0551/bilibili-mp3-frontend registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-frontend:latest
docker push registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-frontend:latest

docker tag liuxy0551/bilibili-mp3-backend registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-backend:latest
docker push registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-backend:latest

echo "=== Done! ==="
