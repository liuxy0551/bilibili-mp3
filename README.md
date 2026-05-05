# bilibili 音频提取

从 bilibili 视频中提取音频并转换为 MP3 格式的 Web 应用。

## 功能特性

- 支持单个/多个 bilibili 视频音频提取
- 支持合集批量提取
- 实时显示提取和转换进度
- 支持自定义文件命名规则
- 支持深色/浅色主题切换
- 现代简约的 UI 设计
- 支持 Docker 一键部署

## 截图展示

![screenshot](./screenshot.png)

## 快速开始

### 使用 Docker Compose（推荐）

```bash
# 克隆项目
git clone https://github.com/liuxy0551/bilibili-mp3.git
cd bilibili-mp3

# 启动服务（使用预构建镜像）
docker-compose up -d

# 访问应用
open http://localhost:5173
```

### 使用 Docker Compose（从源码构建）

```bash
# 使用 dev 配置从源码构建
docker-compose -f docker-compose.dev.yml up -d
```

### 开发环境

```bash
# 启动后端
cd backend
npm install
npm run dev

# 启动前端（新终端）
cd frontend
npm install
npm run dev
```

## 技术栈

- **前端**: React + Vite + TypeScript + Tailwind CSS
- **后端**: Node.js + Express + Socket.io
- **部署**: Docker + Nginx

## 项目结构

```
bilibili-mp3/
├── frontend/          # React 前端
├── backend/           # Node.js 后端
├── nginx/             # Nginx 配置
├── docker-compose.yml # Docker 编排
└── README.md
```

## API 文档

详细的 API 文档请查看 [API.md](./API.md)。

## 开发统计

本项目使用 AI 辅助开发，详细的 AI Coding 指标统计请查看 [AI_CODING_STATS.md](./AI_CODING_STATS.md)。

## 致谢

基于 [bilibili-video2mp3](https://github.com/wxsms/bilibili-video2mp3) 项目开发。

## 许可证

MIT
