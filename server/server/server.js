import express from 'express'
import http from 'http'
import compression from 'compression'
import cors from 'cors'
import bodyParser from 'body-parser'
import bunyan from 'bunyan'

import * as config from './config.js'
import * as users from './controllers/users.js'
import { create } from './socket.js'

const main = async (config) => {
  const app = express()
  app.use(compression())
  app.use(cors())

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
  app.post('/users/:username/messages', users.addUserMessage)

  /**
   * Realtime API
   */
  app.set('socket', await create({ server, config, log }))


  server.listen(config.server.port)
  log.info(`Listening on port ${config.server.port}...`)

  return { app, server }
}

main(config)
