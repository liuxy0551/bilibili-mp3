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

    const totalLength = parseInt(String(response.headers['content-length'] || '0'), 10)
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
