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
