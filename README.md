# Bilibili 视频转 MP3 Web 应用

一个用于下载 Bilibili 视频并转换为 MP3 音频的 Web 应用。

## 功能特性

- 支持单个/多个 Bilibili 视频 URL 下载
- 实时显示下载和转换进度
- 支持自定义文件命名规则
- 现代简约的 UI 设计
- 支持 Docker 一键部署

## 快速开始

### 使用 Docker Compose（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd bilibili-mp3-web

# 启动服务
docker-compose up -d

# 访问应用
open http://localhost
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
bilibili-mp3-web/
├── frontend/          # React 前端
├── backend/           # Node.js 后端
├── nginx/             # Nginx 配置
├── docker-compose.yml # Docker 编排
└── README.md
```

## API 文档

### POST /api/download
开始下载任务

**请求体:**
```json
{
  "url": "https://www.bilibili.com/video/BV...",
  "options": {
    "naming": "TITLE-AUTHOR-DATE",
    "threads": 10,
    "skipMp3": false
  }
}
```

**响应:**
```json
{
  "taskId": "uuid",
  "status": "pending"
}
```

### GET /api/tasks
获取所有任务列表

### GET /api/tasks/:id
获取指定任务详情

### DELETE /api/tasks/:id
取消任务

### GET /api/download/:id/file
下载 MP3 文件

## WebSocket 事件

- `task-progress`: 任务进度更新
- `task-complete`: 任务完成
- `task-error`: 任务错误

## 环境变量

| 变量 | 描述 | 默认值 |
|------|------|--------|
| PORT | 后端端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| DOWNLOAD_DIR | 下载目录 | ./downloads |

## 许可证

MIT
