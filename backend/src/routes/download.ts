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
