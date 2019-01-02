import io from 'socket.io-client'
import state from '-/state'
import logger from '-/logger'

const serverConfig = state.get([ 'config', 'server' ])

const createSocket = onConnect => {
  const socket = io(`${serverConfig.host}:${serverConfig.port}`)
  socket.on('connect', () => {
    logger.debug('websocket connected')
    if (onConnect) {
      onConnect(socket)
    }
  })
  return socket
}

export default createSocket
