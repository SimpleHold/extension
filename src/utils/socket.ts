import { io } from 'socket.io-client'

// Config
import config from '@config/index'

const socket = io(config.serverUrl, { autoConnect: false })

export default socket
