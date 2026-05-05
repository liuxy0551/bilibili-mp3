import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import downloadRoutes from './routes/download.js'
import { setupSocketHandlers } from './websocket/socketHandler.js'
import { taskManager } from './services/taskManager.js'

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

// 每小时清除一次任务
setInterval(() => {
  const tasks = taskManager.getAllTasks()
  if (tasks.length > 0) {
    taskManager.clearAllTasks()
    console.log(`[${new Date().toISOString()}] Cleared ${tasks.length} tasks`)
  }
}, 60 * 60 * 1000)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }
