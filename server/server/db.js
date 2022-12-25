import fs from 'fs/promises'
import path from 'path'
import _ from 'lodash'

import * as config from './config.js'

/**
 * Database helpers
 */
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

/**
 * DAL
 */
export const getUsers = () => select('users')

export const getUser = async username => {
  const users = await getUsers()
  if (!users) {
    return
  }
  return users.find(u => u.username === username) || null
}

export const createUser = async username => {
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

export const updateUser = async ({ username, options }) => {
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
  user.options = _.merge({}, user.options, options)

  await update('users', users)

  return {
    user
  }
}
