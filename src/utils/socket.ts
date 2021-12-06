import { io } from 'socket.io-client'

// Config
import config from '@config/index'

const socket = io(config.socketUrl, {
  autoConnect: false,
  transports: ['websocket'],
  path: '/api/socket.io',
})

export default socket
