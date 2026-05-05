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

  useWebSocket({
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
