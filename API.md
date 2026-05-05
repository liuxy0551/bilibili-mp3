# API 文档

## REST API

### POST /api/download
开始提取任务

**请求体:**
```json
{
  "url": "https://www.bilibili.com/video/BV...",
  "options": {
    "naming": "INDEX-TITLE-AUTHOR",
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

### POST /api/download-collection
开始合集提取任务

**请求体:**
```json
{
  "url": "https://www.bilibili.com/video/BV...",
  "options": {
    "naming": "INDEX-TITLE-AUTHOR",
    "skipMp3": false
  }
}
```

**响应:**
```json
{
  "taskIds": ["uuid1", "uuid2", ...],
  "count": 10
}
```

### GET /api/tasks
获取所有任务列表

**响应:**
```json
[
  {
    "id": "uuid",
    "url": "https://...",
    "title": "视频标题",
    "status": "pending|downloading|converting|completed|failed",
    "progress": 0,
    "createdAt": "2026-05-05T12:00:00Z"
  }
]
```

### GET /api/tasks/:id
获取指定任务详情

### DELETE /api/tasks/:id
取消任务

### DELETE /api/tasks
清除所有任务

### GET /api/download/:id/file
下载 MP3 文件

## WebSocket 事件

通过 Socket.io 连接，监听以下事件：

### task-progress
任务进度更新

**数据:**
```json
{
  "taskId": "uuid",
  "status": "downloading|converting",
  "progress": 50
}
```

### task-complete
任务完成

**数据:**
```json
{
  "taskId": "uuid",
  "title": "视频标题",
  "filename": "output.mp3"
}
```

### task-error
任务错误

**数据:**
```json
{
  "taskId": "uuid",
  "error": "错误信息"
}
```

## 环境变量

| 变量 | 描述 | 默认值 |
|------|------|--------|
| PORT | 后端端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| DOWNLOAD_DIR | 下载目录 | ./downloads |
