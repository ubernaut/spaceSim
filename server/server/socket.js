import * as redis from 'redis'
import * as socketio from 'socket.io'
import msgpack from 'msgpack-lite'
import { v4 as uuid } from 'uuid'

export const create = async ({ server, config, log }) => {
  const io = new socketio.Server(server, {
    cors: {
      origin: '*'
    }
  })

  const pubClient = redis.createClient({
    url: config.redis
  })
  const subClient = pubClient.duplicate()

  await pubClient.connect()
  await subClient.connect()

  pubClient.on('error', err => console.error(err))
  subClient.on('error', err => console.error(err))

  // Store a list of connected sockets to broadcast on
  // TODO: Remove inactive sockets
  const sockets = []

  // Broadcast events to all connected sockets
  subClient.subscribe('events', (message) => {
    sockets.map(socket =>
      socket.emit('event', msgpack.encode(JSON.parse(message)))
    )
  })

  io.on('connection', socket => {
    let time = 0
    const clientId = uuid()

    log.debug({
      handshake: socket.handshake
    }, 'Websocket client connected')

    socket.on('events', data => {
      // console.log('sock:events', data)
      const message = msgpack.decode(data)
      // console.log(message)
      pubClient.publish('events', JSON.stringify(message))
    })
    sockets.push(socket)
  })

  return {
    sockets,
    pubClient,
    subClient
  }
}
