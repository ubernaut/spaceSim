import express from 'express'
import http from 'http'
import compression from 'compression'
import cors from 'cors'
import * as socketio from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import * as redis from 'redis'
import Promise from 'bluebird'
import { v4 as uuid } from 'uuid'
import msgpack from 'msgpack-lite'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'

import * as config from './config.js'
import * as users from './controllers/users.js'

// Promise.promisifyAll(redis.RedisClient.prototype)
// Promise.promisifyAll(redis.Multi.prototype)

const main = async (config) => {
// Promise.promisifyAll(redis.Multi.prototype){
  const app = express()
  app.use(compression())
  app.use(cors())
  // app.all('*', cors())

  const log = bunyan.createLogger({
    name: 'void-api',
    level: 'debug'
  })

  const server = http.Server(app)

  /**
   * Middleware & config
   */
  const stats = {
    hits: 0
  }
  app.use('*', (req, res, next) => {
    stats.hits += 1
    res.wrap = data =>
      res.json({
        success: true,
        payload: data
      })
    next()
  })
  app.use(bodyParser.json())
  app.set('json spaces', 2)

  /**
   * REST API
   */
  app.get('/stats', (req, res, next) => res.json(stats))
  app.get('/users', users.get)
  app.post('/users', users.createUser)
  app.get('/users/:username', users.getUser)
  app.post('/users/:username', users.updateUser)

  /**
   * Realtime API
   */
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

  server.listen(config.server.port)
  log.info(`Listening on port ${config.server.port}...`)

  return { app, server }
}

main(config)
