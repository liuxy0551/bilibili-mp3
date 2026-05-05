#!/bin/bash

# 构建镜像 (amd64)
docker buildx build --platform linux/amd64 -f frontend/Dockerfile -t liuxy0551/bilibili-mp3-frontend ./frontend
docker buildx build --platform linux/amd64 -f backend/Dockerfile -t liuxy0551/bilibili-mp3-backend ./backend

# 推送到阿里云容器镜像服务
docker tag liuxy0551/bilibili-mp3-frontend registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-frontend:latest
docker push registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-frontend:latest

docker tag liuxy0551/bilibili-mp3-backend registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-backend:latest
docker push registry.cn-hangzhou.aliyuncs.com/liuxy0551/bilibili-mp3-backend:latest
