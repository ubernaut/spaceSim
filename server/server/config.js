import path from 'path'

export const redis = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

export const server = {
  port: process.env.PORT || 1137
}

export const directories = {
  data: path.dirname('../data')
}
