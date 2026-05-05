# Bilibili 视频转 MP3 Web 应用实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 bilibili-video2mp3 命令行工具转换为 Web 应用，支持 docker compose 一键部署

**Architecture:** React + Vite 前端，Node.js + Express 后端，REST API + WebSocket 通信，多容器 Docker 部署

**Tech Stack:** React, Vite, TypeScript, Node.js, Express, Socket.io, Docker, Nginx

---

## 文件结构

```
bilibili-mp3-web/
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── components/         # React 组件
│   │   │   ├── UrlInput.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── SettingsPanel.tsx
│   │   ├── hooks/              # 自定义 hooks
│   │   │   └── useWebSocket.ts
│   │   ├── context/            # React Context
│   │   │   └── TaskContext.tsx
│   │   ├── services/           # API 服务
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript 类型
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/                     # Node.js 后端
│   ├── src/
│   │   ├── routes/             # Express 路由
│   │   │   └── download.ts
│   │   ├── services/           # 业务逻辑
│   │   │   ├── downloadService.ts
│   │   │   └── taskManager.ts
│   │   ├── websocket/          # WebSocket 处理
│   │   │   └── socketHandler.ts
│   │   ├── utils/              # 工具函数
│   │   │   ├── bilibili.ts
│   │   │   └── ffmpeg.ts
│   │   ├── types/              # TypeScript 类型
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── nginx/                       # Nginx 配置
│   └── default.conf
└── downloads/                   # 下载文件目录
```

---

## Task 1: 初始化前端项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/index.css`

- [ ] **Step 1: 创建前端 package.json**

```json
{
  "name": "bilibili-mp3-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.4",
    "axios": "^1.6.7",
    "lucide-react": "^0.323.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
})
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bilibili 视频转 MP3</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 7: 创建 App.tsx**

```typescript
import { TaskProvider } from './context/TaskContext'
import UrlInput from './components/UrlInput'
import TaskList from './components/TaskList'
import SettingsPanel from './components/SettingsPanel'

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Bilibili 视频转 MP3
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              下载 Bilibili 视频并转换为 MP3 音频
            </p>
          </header>
          
          <main className="space-y-6">
            <UrlInput />
            <TaskList />
            <SettingsPanel />
          </main>
          
          <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>基于 bilibili-video2mp3 项目</p>
          </footer>
        </div>
      </div>
    </TaskProvider>
  )
}

export default App
```

- [ ] **Step 8: 创建 index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}
```

- [ ] **Step 9: 安装依赖并验证**

```bash
cd frontend && npm install
```

- [ ] **Step 10: 提交代码**

```bash
git add frontend/
git commit -m "feat: initialize frontend project with React + Vite + TypeScript"
```

---

## Task 2: 创建前端类型定义和 API 服务

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/services/api.ts`

- [ ] **Step 1: 创建 types/index.ts**

```typescript
export interface Task {
  id: string
  url: string
  status: 'pending' | 'downloading' | 'converting' | 'completed' | 'error'
  progress: number
  filename?: string
  error?: string
  title?: string
  author?: string
  createdAt: Date
  updatedAt: Date
}

export interface DownloadOptions {
  naming?: string
  threads?: number
  skipMp3?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

- [ ] **Step 2: 创建 services/api.ts**

```typescript
import axios from 'axios'
import { Task, DownloadOptions, ApiResponse } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export async function startDownload(url: string, options?: DownloadOptions): Promise<ApiResponse<{ taskId: string }>> {
  try {
    const response = await api.post('/download', { url, options })
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

export async function getTasks(): Promise<ApiResponse<Task[]>> {
  try {
    const response = await api.get('/tasks')
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

export async function getTask(taskId: string): Promise<ApiResponse<Task>> {
  try {
    const response = await api.get(`/tasks/${taskId}`)
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

export async function cancelTask(taskId: string): Promise<ApiResponse<void>> {
  try {
    await api.delete(`/tasks/${taskId}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || error.message }
  }
}

export function getDownloadUrl(taskId: string): string {
  return `/api/download/${taskId}/file`
}
```

- [ ] **Step 3: 提交代码**

```bash
git add frontend/src/types/ frontend/src/services/
git commit -m "feat: add TypeScript types and API service"
```

---

## Task 3: 创建 WebSocket Hook 和 Task Context

**Files:**
- Create: `frontend/src/hooks/useWebSocket.ts`
- Create: `frontend/src/context/TaskContext.tsx`

- [ ] **Step 1: 创建 hooks/useWebSocket.ts**

```typescript
import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { Task } from '../types'

interface UseWebSocketOptions {
  onTaskProgress?: (taskId: string, progress: number) => void
  onTaskComplete?: (taskId: string, task: Task) => void
  onTaskError?: (taskId: string, error: string) => void
}

export function useWebSocket(options: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    if (options.onTaskProgress) {
      socket.on('task-progress', ({ taskId, progress }) => {
        options.onTaskProgress!(taskId, progress)
      })
    }

    if (options.onTaskComplete) {
      socket.on('task-complete', ({ taskId, task }) => {
        options.onTaskComplete!(taskId, task)
      })
    }

    if (options.onTaskError) {
      socket.on('task-error', ({ taskId, error }) => {
        options.onTaskError!(taskId, error)
      })
    }

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }, [])

  return { emit }
}
```

- [ ] **Step 2: 创建 context/TaskContext.tsx**

```typescript
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Task } from '../types'
import { useWebSocket } from '../hooks/useWebSocket'
import * as api from '../services/api'

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  addTask: (url: string) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  refreshTasks: () => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await api.getTasks()
    if (result.success && result.data) {
      setTasks(result.data)
    } else {
      setError(result.error || '获取任务列表失败')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  const { emit } = useWebSocket({
    onTaskProgress: useCallback((taskId: string, progress: number) => {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, progress } : task
      ))
    }, []),
    
    onTaskComplete: useCallback((taskId: string, updatedTask: Task) => {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ))
    }, []),
    
    onTaskError: useCallback((taskId: string, error: string) => {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'error', error } : task
      ))
    }, []),
  })

  const addTask = useCallback(async (url: string) => {
    setError(null)
    const result = await api.startDownload(url)
    if (result.success) {
      await refreshTasks()
    } else {
      setError(result.error || '创建任务失败')
    }
  }, [refreshTasks])

  const removeTask = useCallback(async (taskId: string) => {
    setError(null)
    const result = await api.cancelTask(taskId)
    if (result.success) {
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } else {
      setError(result.error || '删除任务失败')
    }
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, removeTask, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
```

- [ ] **Step 3: 提交代码**

```bash
git add frontend/src/hooks/ frontend/src/context/
git commit -m "feat: add WebSocket hook and Task context"
```

---

## Task 4: 创建前端组件

**Files:**
- Create: `frontend/src/components/UrlInput.tsx`
- Create: `frontend/src/components/TaskList.tsx`
- Create: `frontend/src/components/TaskItem.tsx`
- Create: `frontend/src/components/ProgressBar.tsx`
- Create: `frontend/src/components/SettingsPanel.tsx`

- [ ] **Step 1: 创建 components/UrlInput.tsx**

```typescript
import React, { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { Download, Link } from 'lucide-react'

export default function UrlInput() {
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(true)
  const { addTask, loading } = useTaskContext()

  const validateUrl = (value: string) => {
    const bilibiliRegex = /^https?:\/\/(www\.)?bilibili\.com\/video\/[A-Za-z0-9]+/
    return bilibiliRegex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setIsValid(false)
      return
    }

    if (!validateUrl(url)) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    await addTask(url.trim())
    setUrl('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bilibili 视频链接
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setIsValid(true)
              }}
              placeholder="https://www.bilibili.com/video/BV..."
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                !isValid ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
          </div>
          {!isValid && (
            <p className="mt-1 text-sm text-red-500">
              请输入有效的 Bilibili 视频链接
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          {loading ? '处理中...' : '开始下载'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: 创建 components/ProgressBar.tsx**

```typescript
import { clsx } from 'clsx'

interface ProgressBarProps {
  progress: number
  status: string
  className?: string
}

export default function ProgressBar({ progress, status, className }: ProgressBarProps) {
  const getColor = () => {
    switch (status) {
      case 'downloading':
        return 'bg-blue-500'
      case 'converting':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'pending':
        return '等待中'
      case 'downloading':
        return `下载中 ${progress}%`
      case 'converting':
        return '转换中'
      case 'completed':
        return '已完成'
      case 'error':
        return '失败'
      default:
        return '未知'
    }
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {getLabel()}
        </span>
        {status === 'downloading' && (
          <span className="text-xs font-medium text-gray-500">
            {progress}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={clsx('h-2 rounded-full transition-all duration-300', getColor())}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 components/TaskItem.tsx**

```typescript
import { Task } from '../types'
import { useTaskContext } from '../context/TaskContext'
import { getDownloadUrl } from '../services/api'
import ProgressBar from './ProgressBar'
import { Download, X, Music, Video, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { clsx } from 'clsx'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const { removeTask } = useTaskContext()

  const getStatusIcon = () => {
    switch (task.status) {
      case 'pending':
        return <Loader className="h-5 w-5 text-gray-400 animate-spin" />
      case 'downloading':
        return <Download className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'converting':
        return <Music className="h-5 w-5 text-yellow-500 animate-pulse" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const handleDownload = () => {
    if (task.id) {
      window.open(getDownloadUrl(task.id), '_blank')
    }
  }

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-slide-up',
      task.status === 'error' && 'border-l-4 border-red-500'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {task.title || task.url}
            </h3>
            {task.author && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {task.author}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {task.status === 'completed' && (
            <button
              onClick={handleDownload}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="下载 MP3"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => removeTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="删除任务"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.status !== 'pending' && (
        <div className="mt-3">
          <ProgressBar progress={task.progress} status={task.status} />
        </div>
      )}

      {task.error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400">
          {task.error}
        </div>
      )}

      {task.status === 'completed' && task.filename && (
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Video className="h-3 w-3 mr-1" />
          {task.filename}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: 创建 components/TaskList.tsx**

```typescript
import { useTaskContext } from '../context/TaskContext'
import TaskItem from './TaskItem'
import { Inbox } from 'lucide-react'

export default function TaskList() {
  const { tasks, loading, error } = useTaskContext()

  if (loading && tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          还没有下载任务
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          输入 Bilibili 视频链接开始下载
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          下载任务 ({tasks.length})
        </h2>
      </div>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 components/SettingsPanel.tsx**

```typescript
import { useState } from 'react'
import { Settings, ChevronDown, ChevronUp } from 'lucide-react'

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [naming, setNaming] = useState('TITLE-AUTHOR-DATE')
  const [threads, setThreads] = useState(10)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            高级设置
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              文件命名规则
            </label>
            <select
              value={naming}
              onChange={(e) => setNaming(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="TITLE-AUTHOR-DATE">标题-作者-日期</option>
              <option value="INDEX-TITLE-AUTHOR-DATE">序号-标题-作者-日期</option>
              <option value="TITLE">仅标题</option>
              <option value="INDEX-TITLE">序号-标题</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              可用变量: INDEX, TITLE, AUTHOR, DATE
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              下载线程数
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={threads}
              onChange={(e) => setThreads(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1</span>
              <span>{threads}</span>
              <span>20</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              注意: 设置将在下次下载时生效
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6: 提交代码**

```bash
git add frontend/src/components/
git commit -m "feat: add all frontend components (UrlInput, TaskList, TaskItem, ProgressBar, SettingsPanel)"
```

---

## Task 5: 创建 Tailwind CSS 和 PostCSS 配置

**Files:**
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`

- [ ] **Step 1: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: 提交代码**

```bash
git add frontend/tailwind.config.js frontend/postcss.config.js
git commit -m "chore: add Tailwind CSS and PostCSS configuration"
```

---

## Task 6: 初始化后端项目

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/index.ts`
- Create: `backend/src/types/index.ts`

- [ ] **Step 1: 创建 backend/package.json**

```json
{
  "name": "bilibili-mp3-backend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext ts --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "filenamify": "^5.1.1",
    "socket.io": "^4.7.4",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.10",
    "@types/uuid": "^9.0.7",
    "eslint": "^8.56.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: 创建 backend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: 创建 backend/src/types/index.ts**

```typescript
export interface Task {
  id: string
  url: string
  status: 'pending' | 'downloading' | 'converting' | 'completed' | 'error'
  progress: number
  filename?: string
  error?: string
  title?: string
  author?: string
  createdAt: Date
  updatedAt: Date
}

export interface DownloadOptions {
  naming?: string
  threads?: number
  skipMp3?: boolean
}

export interface VideoData {
  bvid: string
  aid: number
  title: string
  owner: {
    name: string
  }
  ctime: number
  pages: Array<{
    cid: number
    part: string
  }>
}
```

- [ ] **Step 4: 创建 backend/src/index.ts**

```typescript
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import downloadRoutes from './routes/download.js'
import { setupSocketHandlers } from './websocket/socketHandler.js'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE']
  }
})

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', downloadRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

setupSocketHandlers(io)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }
```

- [ ] **Step 5: 安装依赖**

```bash
cd backend && npm install
```

- [ ] **Step 6: 提交代码**

```bash
git add backend/
git commit -m "feat: initialize backend project with Express and Socket.io"
```

---

## Task 7: 创建后端服务和路由

**Files:**
- Create: `backend/src/services/taskManager.ts`
- Create: `backend/src/services/downloadService.ts`
- Create: `backend/src/routes/download.ts`
- Create: `backend/src/utils/bilibili.ts`
- Create: `backend/src/utils/ffmpeg.ts`

- [ ] **Step 1: 创建 services/taskManager.ts**

```typescript
import { Task } from '../types/index.js'

class TaskManager {
  private tasks: Map<string, Task> = new Map()

  createTask(id: string, url: string): Task {
    const task: Task = {
      id,
      url,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.tasks.set(id, task)
    return task
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values())
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id)
    if (task) {
      const updatedTask = { ...task, ...updates, updatedAt: new Date() }
      this.tasks.set(id, updatedTask)
      return updatedTask
    }
    return undefined
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id)
  }
}

export const taskManager = new TaskManager()
```

- [ ] **Step 2: 创建 utils/bilibili.ts**

```typescript
import axios from 'axios'
import { VideoData } from '../types/index.js'

axios.defaults.headers = {
  referer: 'https://www.bilibili.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0'
}

export async function getVideoData(url: string): Promise<{ videoData: VideoData, p: number }> {
  const { data } = await axios.get(url)
  const initialStateStr = data.match(/__INITIAL_STATE__=(.*?);\(function\(\)/)?.[1]
  
  if (!initialStateStr) {
    throw new Error('无法解析视频数据')
  }
  
  return JSON.parse(initialStateStr)
}

export async function getAudioUrl(bvid: string, cid: number): Promise<string> {
  const playUrl = `https://api.bilibili.com/x/player/playurl?fnval=80&cid=${cid}&bvid=${bvid}`
  const playResult = await axios.get(playUrl)
  
  if (!playResult.data?.data?.dash?.audio?.[0]?.baseUrl) {
    throw new Error('无法获取音频下载链接')
  }
  
  return playResult.data.data.dash.audio[0].baseUrl
}
```

- [ ] **Step 3: 创建 utils/ffmpeg.ts**

```typescript
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function convertToMp3(inputFile: string, outputFile: string): Promise<void> {
  try {
    await execAsync(`ffmpeg -y -i "${inputFile}" -q:a 0 "${outputFile}"`)
  } catch (error: any) {
    throw new Error(`FFmpeg 转换失败: ${error.message}`)
  }
}
```

- [ ] **Step 4: 创建 services/downloadService.ts**

```typescript
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { taskManager } from './taskManager.js'
import { getVideoData, getAudioUrl } from '../utils/bilibili.js'
import { convertToMp3 } from '../utils/ffmpeg.js'
import { io } from '../index.js'

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || './downloads'

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })
}

export async function startDownload(url: string, options?: { naming?: string; skipMp3?: boolean }): Promise<string> {
  const taskId = uuidv4()
  taskManager.createTask(taskId, url)

  processDownload(taskId, url, options).catch(error => {
    console.error(`Download failed for task ${taskId}:`, error)
    taskManager.updateTask(taskId, { status: 'error', error: error.message })
    io.emit('task-error', { taskId, error: error.message })
  })

  return taskId
}

async function processDownload(taskId: string, url: string, options?: { naming?: string; skipMp3?: boolean }): Promise<void> {
  try {
    taskManager.updateTask(taskId, { status: 'downloading', progress: 0 })
    
    const { videoData, p } = await getVideoData(url)
    const pages = videoData.pages
    const isSingle = pages.length === 1
    const cid = pages[p - 1].cid
    const title = (isSingle ? videoData.title : pages[p - 1].part).replace(/\s/g, '-')
    const author = videoData.owner.name

    taskManager.updateTask(taskId, { title, author })
    io.emit('task-progress', { taskId, progress: 0, title, author })

    const audioUrl = await getAudioUrl(videoData.bvid, cid)
    
    const date = new Date(videoData.ctime * 1000)
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const baseFilename = `${title}-${author}-${dateString}`.replace(/[^\w\s-]/g, '')
    
    const flvFile = path.join(DOWNLOAD_DIR, `${taskId}.flv`)
    const mp3File = path.join(DOWNLOAD_DIR, `${taskId}.mp3`)

    const response = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream',
      headers: { Range: 'bytes=0-' }
    })

    const totalLength = parseInt(response.headers['content-length'] || '0', 10)
    let downloadedLength = 0

    const writer = fs.createWriteStream(flvFile)
    response.data.pipe(writer)

    response.data.on('data', (chunk: Buffer) => {
      downloadedLength += chunk.length
      const progress = totalLength > 0 ? Math.round((downloadedLength / totalLength) * 100) : 0
      taskManager.updateTask(taskId, { progress })
      io.emit('task-progress', { taskId, progress })
    })

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    if (!options?.skipMp3) {
      taskManager.updateTask(taskId, { status: 'converting', progress: 100 })
      io.emit('task-progress', { taskId, progress: 100, status: 'converting' })

      await convertToMp3(flvFile, mp3File)

      fs.unlinkSync(flvFile)
    }

    const finalFilename = options?.skipMp3 ? `${baseFilename}.flv` : `${baseFilename}.mp3`
    const finalFile = path.join(DOWNLOAD_DIR, finalFilename)
    
    if (fs.existsSync(finalFile)) {
      fs.unlinkSync(finalFile)
    }
    fs.renameSync(options?.skipMp3 ? flvFile : mp3File, finalFile)

    taskManager.updateTask(taskId, { 
      status: 'completed', 
      progress: 100,
      filename: finalFilename
    })
    io.emit('task-complete', { 
      taskId, 
      task: taskManager.getTask(taskId) 
    })

  } catch (error: any) {
    throw error
  }
}

export function getTaskFile(taskId: string): string | null {
  const task = taskManager.getTask(taskId)
  if (!task || task.status !== 'completed' || !task.filename) {
    return null
  }
  
  const filePath = path.join(DOWNLOAD_DIR, task.filename)
  if (fs.existsSync(filePath)) {
    return filePath
  }
  return null
}
```

- [ ] **Step 5: 创建 routes/download.ts**

```typescript
import { Router, Request, Response } from 'express'
import { taskManager } from '../services/taskManager.js'
import { startDownload, getTaskFile } from '../services/downloadService.js'
import * as path from 'path'

const router = Router()

router.post('/download', async (req: Request, res: Response) => {
  try {
    const { url, options } = req.body
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' })
    }

    const bilibiliRegex = /^https?:\/\/(www\.)?bilibili\.com\/video\/[A-Za-z0-9]+/
    if (!bilibiliRegex.test(url)) {
      return res.status(400).json({ message: 'Invalid bilibili URL' })
    }

    const taskId = await startDownload(url, options)
    res.json({ taskId, status: 'pending' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/tasks', (req: Request, res: Response) => {
  const tasks = taskManager.getAllTasks()
  res.json(tasks)
})

router.get('/tasks/:id', (req: Request, res: Response) => {
  const task = taskManager.getTask(req.params.id)
  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }
  res.json(task)
})

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const success = taskManager.deleteTask(req.params.id)
  if (!success) {
    return res.status(404).json({ message: 'Task not found' })
  }
  res.json({ success: true })
})

router.get('/download/:id/file', (req: Request, res: Response) => {
  const filePath = getTaskFile(req.params.id)
  if (!filePath) {
    return res.status(404).json({ message: 'File not found' })
  }
  
  const filename = path.basename(filePath)
  res.download(filePath, filename)
})

export default router
```

- [ ] **Step 6: 创建 websocket/socketHandler.ts**

```typescript
import { Server, Socket } from 'socket.io'

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })
}
```

- [ ] **Step 7: 提交代码**

```bash
git add backend/src/
git commit -m "feat: implement backend services, routes, and utilities"
```

---

## Task 8: 创建 Docker 配置

**Files:**
- Create: `backend/Dockerfile`
- Create: `frontend/Dockerfile`
- Create: `docker-compose.yml`
- Create: `docker-compose.prod.yml`
- Create: `nginx/default.conf`

- [ ] **Step 1: 创建 backend/Dockerfile**

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY dist/ ./dist/

RUN mkdir -p /app/downloads

ENV NODE_ENV=production
ENV PORT=3000
ENV DOWNLOAD_DIR=/app/downloads

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

- [ ] **Step 2: 创建 frontend/Dockerfile**

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: 创建 nginx/default.conf**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] **Step 4: 创建 docker-compose.yml**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - downloads:/app/downloads
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DOWNLOAD_DIR=/app/downloads
    networks:
      - app-network

volumes:
  downloads:

networks:
  app-network:
    driver: bridge
```

- [ ] **Step 5: 创建 docker-compose.prod.yml**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - downloads:/app/downloads
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DOWNLOAD_DIR=/app/downloads
    networks:
      - app-network
    restart: unless-stopped

volumes:
  downloads:

networks:
  app-network:
    driver: bridge
```

- [ ] **Step 6: 创建 .dockerignore**

```
node_modules
dist
.git
.env
*.log
```

- [ ] **Step 7: 提交代码**

```bash
git add backend/Dockerfile frontend/Dockerfile nginx/ docker-compose.yml docker-compose.prod.yml .dockerignore
git commit -m "feat: add Docker configuration for multi-container deployment"
```

---

## Task 9: 创建构建脚本和文档

**Files:**
- Create: `build.sh`
- Create: `README.md`
- Create: `.gitignore`

- [ ] **Step 1: 创建 build.sh**

```bash
#!/bin/bash

echo "Building backend..."
cd backend
npm run build
cd ..

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build complete!"
```

- [ ] **Step 2: 创建 README.md**

```markdown
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
```

- [ ] **Step 3: 创建 .gitignore**

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# Docker
downloads/
*.log
```

- [ ] **Step 4: 提交代码**

```bash
git add build.sh README.md .gitignore
git commit -m "docs: add build script, README, and gitignore"
```

---

## Task 10: 测试和验证

- [ ] **Step 1: 构建后端**

```bash
cd backend && npm run build
```

- [ ] **Step 2: 构建前端**

```bash
cd frontend && npm run build
```

- [ ] **Step 3: 启动 Docker Compose**

```bash
docker-compose up -d
```

- [ ] **Step 4: 验证服务**

访问 http://localhost 确认前端正常运行

访问 http://localhost:3000/health 确认后端正常运行

- [ ] **Step 5: 测试下载功能**

在网页中输入一个 Bilibili 视频 URL，测试下载流程

- [ ] **Step 6: 最终提交**

```bash
git add .
git commit -m "feat: complete bilibili video to mp3 web application"
```

---

## 完成

所有任务完成后，用户可以通过以下命令一键启动应用：

```bash
docker-compose up -d
```

然后访问 http://localhost 即可使用。
