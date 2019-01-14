const apiUrl = 'http://localhost:1137'

export const client = {
  get: async (route, data = {}) => {
    return (await fetch(`${apiUrl}${route}`)).json()
  },
  post: async (route, data = {}) => {
    console.log({ data })
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

export const getUser = async username => {
  return client.get(`/users/${username}`)
}

export const createUser = async username => {
  const response = await client.post('/users', { username })

  return response
}

export const updateUser = async (username, options) => {
  await client.post(`/users/${username}`, { options })
}
