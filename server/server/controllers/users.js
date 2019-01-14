const db = require('../db')

exports.get = async (req, res) => {
  const users = await db.getUsers()
  res.wrap(users)
}

exports.getUser = async (req, res) => {
  const user = await db.getUser(req.params.username)
  res.wrap(user)
}

exports.createUser = async (req, res) => {
  const user = await db.createUser(req.body.username)
  res.wrap(user)
}

exports.updateUser = async (req, res) => {
  const { error, user } = await db.updateUser({
    username: req.params.username,
    options: req.body.options
  })
  if (error) {
    return res.wrap(error)
  }
  res.wrap(user)
}
