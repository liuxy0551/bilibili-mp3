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
