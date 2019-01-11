const express = require('express')
const http = require('http')
const compression = require('compression')
const cors = require('cors')
const socketio = require('socket.io')
const redis = require('redis')
const Promise = require('bluebird')
const uuid = require('uuid/v4')
const msgpack = require('msgpack-lite')

const config = require('./config')

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

module.exports = async config => {
  const app = express()
  app.use(compression())
  app.use(cors())
  app.all('*', cors())

  const server = http.Server(app)

  /**
   * Middleware
   */
  const stats = {
    hits: 0
  }
  app.use('*', (req, res, next) => {
    stats.hits += 1
    next()
  })

  /**
   * REST API
   */
  app.get('/stats', (req, res, next) => res.json(stats))

  /**
   * Realtime API
   */
  const io = socketio(server)

  const pub = redis.createClient(config.redis)
  const sub = redis.createClient(config.redis)
  sub.subscribe('events')

  pub.on('error', err => console.error(err))
  sub.on('error', err => console.error(err))

  io.on('connection', socket => {
    let time = 0
    const clientId = uuid()
    console.log('conn', clientId)
    socket.on('events', data => {
      const message = msgpack.decode(data)
      pub.publish(
        'events',
        JSON.stringify({
          playerId: clientId,
          message
        })
      )
    })
    sub.on('message', (channel, message) => {
      socket.emit('event', msgpack.encode(JSON.parse(message)))
    })
  })

  server.listen(config.server.port)
  console.log(`listening on port ${config.server.port}...`)

  return { app, server }
}

if (!module.parent) {
  module.exports(config)
}