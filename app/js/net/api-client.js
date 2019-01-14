import state from '-/state'

const serverConfig = state.get([ 'config', 'server' ])
const apiUrl = `${serverConfig.host}:${serverConfig.port}`

/**
 * API Client
 */
export const client = {
  get: async (route, data = {}) => {
    return (await fetch(`${apiUrl}${route}`)).json()
  },
  post: async (route, data = {}) => {
    const result = await fetch(`${apiUrl}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return result
  }
}

/**
 * API Methods
 */
export const getUser = async username => {
  return client.get(`/users/${username}`)
}

export const createUser = async username => {
  return client.post('/users', { username })
}

export const updateUser = async (username, options) => {
  return client.post(`/users/${username}`, { options })
}
