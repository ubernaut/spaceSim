import * as  db from '../db.js'
import msgpack from 'msgpack-lite'

export const get = async (req, res) => {
  const users = await db.getUsers()
  res.wrap(users)
}

export const getUser = async (req, res) => {
  const user = await db.getUser(req.params.username)
  res.wrap(user)
}

export const createUser = async (req, res) => {
  const user = await db.createUser(req.body.username)
  res.wrap(user)
}

export const updateUser = async (req, res) => {
  const { error, user } = await db.updateUser({
    username: req.params.username,
    options: req.body.options
  })
  if (error) {
    return res.wrap(error)
  }
  res.wrap(user)
}

export const addUserMessage = async (req, res) => {
  const { sockets } = req.app.get('socket')
  const { body } = req.body
  sockets.map(socket =>
    socket.emit('event', msgpack.encode({
      type: 'CHAT',
      body
    }))
  )
  res.wrap({})
}
