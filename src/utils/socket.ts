import { io } from 'socket.io-client'

// Config
import config, { isDevMode } from '@config/index'

const socket = io(config.socketUrl, {
  autoConnect: false,
  transports: ['websocket'],
  path: isDevMode ? '/socket.io' : '/api/socket.io',
})

export default socket
