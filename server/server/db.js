const fs = require('fs').promises
const path = require('path')
const config = require('./config')

const select = async tableName => {
  const data = await fs.readFile(
    path.join(config.directories.data, `${tableName}.json`)
  )
  return JSON.parse(data.toString())
}

const update = async (tableName, data) => {
  return fs.writeFile(
    path.join(config.directories.data, `${tableName}.json`),
    JSON.stringify(data, null, 2)
  )
}

const getUsers = () => select('users')
exports.getUsers = getUsers

const getUser = async username => {
  const users = await getUsers()
  if (!users) {
    return
  }
  return users.find(u => u.username === username) || null
}
exports.getUser = getUser

const createUser = async username => {
  const users = await getUsers()
  const newUser = {
    username: username,
    type: 'admin',
    options: {
      ship: {
        thrustColor: '#ffffff'
      }
    }
  }
  await update('users', [ ...users, newUser ])

  return newUser
}
exports.createUser = createUser

const updateUser = async ({ username, options }) => {
  const users = await getUsers()
  if (!users) {
    return {
      error: 'no users'
    }
  }

  const user = users.find(u => u.username === username)
  if (!user) {
    console.log('user not found', { username })
    return {
      error: 'no user'
    }
  }
  console.log({ user })
  user.options = Object.assign({}, user.options, options)
  console.log({ user })
  await update('users', users)

  return {
    user
  }
}
exports.updateUser = updateUser
