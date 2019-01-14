const path = require('path')

exports.redis = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

exports.server = {
  port: process.env.PORT || 1137
}

exports.directories = {
  data: path.join(__dirname, '../data')
}
