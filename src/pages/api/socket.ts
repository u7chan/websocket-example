import type { NextApiRequest, NextApiResponse } from 'next'
import { WebSocketServer } from 'ws'

const handler = (
  _: NextApiRequest,
  res: NextApiResponse & { socket?: { server: { wss?: WebSocketServer } } },
) => {
  if (!res.socket.server.wss) {
    console.log('Starting WebSocket server...')
    const wss = new WebSocketServer({ port: 3001 })

    wss.on('connection', (ws) => {
      console.log('Client connected')

      ws.on('message', (data, isBinary) => {
        const bufferSize = !Array.isArray(data) ? Buffer.byteLength(data) : data.length
        console.log(`bufferSize: ${bufferSize}`)
        if (!isBinary) {
          // text
          const message = data.toString()
          ws.send(`[${new Date().toISOString()}][RECV]: ${message}`)
        } else {
          // binary
        }
      })

      ws.on('close', () => {
        console.log('Client disconnected')
      })
    })
    res.socket.server.wss = wss
    res.status(201).json({ status: 'Socket is started' })
    return
  }
  console.log('WebSocket server already started')
  res.status(200).json({ status: 'Socket is already running' })
}

export default handler
