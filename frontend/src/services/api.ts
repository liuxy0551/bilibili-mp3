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
