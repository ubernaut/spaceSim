import { io } from 'socket.io-client'
import state from '-/state'
import logger from '-/utils/logger'

const serverConfig = state.get(['config', 'server'])

const createSocket = (onConnect) => {
  const socket = io(serverConfig.socketHost, {
    withCredentials: false,
  })
  socket.on('connect', () => {
    logger.debug('websocket connected')
    if (onConnect) {
      onConnect(socket)
    }
  })
  return socket
}

export default createSocket
