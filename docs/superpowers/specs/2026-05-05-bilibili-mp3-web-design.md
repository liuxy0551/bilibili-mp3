# Bilibili 视频转 MP3 Web 应用设计文档

## 项目概述

基于 bilibili-video2mp3 项目开发一个 Web 应用，用户可以通过网页界面下载 bilibili 视频的音频，并支持 docker compose 一键部署。

## 架构设计

### 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端容器       │    │   后端容器       │    │   共享存储       │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (Downloads)   │
│   Port: 80      │    │   Port: 3000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术栈

- **前端**: React + Vite + TypeScript
- **后端**: Node.js + Express
- **通信**: REST API + WebSocket
- **部署**: Docker Compose (多容器)

## 前端设计

### 主要组件

1. **URL 输入组件**
   - 支持单个/多个 bilibili URL 输入
   - URL 格式验证
   - 批量输入支持

2. **下载列表组件**
   - 显示所有下载任务
   - 实时状态更新
   - 任务操作（取消、重试）

3. **进度显示组件**
   - 下载进度条
   - 转换状态显示
   - 预计剩余时间

4. **设置面板组件**
   - 文件命名规则配置
   - 下载线程数设置
   - 音频质量选择

### UI 设计风格

- 现代简约风格
- 响应式设计
- 无障碍访问支持
- 深色/浅色主题切换

### 状态管理

使用 React Context 管理全局状态：
- 下载任务列表
- 用户设置
- 连接状态

## 后端设计

### 核心功能

1. **任务管理**
   - 创建下载任务
   - 查询任务状态
   - 取消下载任务

2. **下载处理**
   - 调用原项目下载逻辑
   - 进度追踪
   - 错误处理和重试

3. **音频转换**
   - 调用 ffmpeg 转换
   - 转换进度追踪
   - 临时文件清理

### API 设计

#### REST API

- `POST /api/download`
  - 请求体: `{ url: string, options: object }`
  - 响应: `{ taskId: string, status: string }`

- `GET /api/tasks`
  - 响应: `Task[]`

- `GET /api/tasks/:id`
  - 响应: `Task`

- `DELETE /api/tasks/:id`
  - 响应: `{ success: boolean }`

- `GET /api/download/:id/file`
  - 响应: MP3 文件流

#### WebSocket 事件

- `task-progress`: 任务进度更新
- `task-complete`: 任务完成
- `task-error`: 任务错误

### 数据模型

```typescript
interface Task {
  id: string;
  url: string;
  status: 'pending' | 'downloading' | 'converting' | 'completed' | 'error';
  progress: number;
  filename?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Docker 配置

### 容器划分

1. **前端容器**
   - 基础镜像: nginx:alpine
   - 服务静态文件
   - 反向代理 API 请求

2. **后端容器**
   - 基础镜像: node:18-alpine
   - 运行 Express 服务
   - 包含 ffmpeg

### 网络配置

- 使用 Docker 网络连接容器
- 前端通过 Nginx 反向代理访问后端
- 共享下载文件目录

### 卷配置

- 下载文件目录: `./downloads:/app/downloads`
- 配置文件: `./config:/app/config`

## 数据流

1. 用户输入 bilibili URL
2. 前端验证 URL 格式
3. 前端发送 POST /api/download 请求
4. 后端创建下载任务，返回任务 ID
5. 后端开始下载视频，通过 WebSocket 推送进度
6. 下载完成后，后端调用 ffmpeg 转换为 MP3
7. 转换完成后，前端显示下载链接
8. 用户点击下载 MP3 文件

## 错误处理

### 前端错误处理

- URL 格式验证
- 网络请求错误提示
- 任务状态异常处理

### 后端错误处理

- 网络错误: 最多重试 3 次
- 下载失败: 记录日志，通知前端
- 转换失败: 清理临时文件，返回错误
- 无效 URL: 返回 400 错误

### 日志记录

- 访问日志
- 错误日志
- 下载统计

## 安全考虑

1. **输入验证**
   - URL 格式验证
   - 防止路径遍历攻击

2. **速率限制**
   - API 请求频率限制
   - 并发下载数量限制

3. **文件安全**
   - 临时文件及时清理
   - 下载文件权限控制

## 性能优化

1. **前端优化**
   - 代码分割
   - 懒加载组件
   - 缓存策略

2. **后端优化**
   - 流式处理
   - 连接池
   - 内存管理

3. **Docker 优化**
   - 多阶段构建
   - 镜像层缓存
   - 资源限制

## 测试策略

1. **单元测试**
   - 组件测试
   - API 测试
   - 工具函数测试

2. **集成测试**
   - API 集成测试
   - WebSocket 测试

3. **端到端测试**
   - 用户流程测试
   - 错误场景测试

## 部署说明

### 开发环境

```bash
docker-compose up -d
```

### 生产环境

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 环境变量

- `NODE_ENV`: 运行环境
- `PORT`: 后端端口
- `DOWNLOAD_DIR`: 下载目录
- `MAX_CONCURRENT_DOWNLOADS`: 最大并发下载数

## 后续扩展

1. **功能扩展**
   - 支持更多视频平台
   - 批量下载优化
   - 下载历史记录

2. **性能扩展**
   - 分布式下载
   - CDN 加速
   - 数据库支持

3. **用户体验**
   - 移动端优化
   - 离线支持
   - 推送通知
