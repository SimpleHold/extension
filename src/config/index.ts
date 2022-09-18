export const isDevMode = process.env.NODE_ENV === 'development'

export default {
  isDevMode,
  apiKey: {
    amplitude: isDevMode ? '' : 'a9ef99a1f9f24a563cc32a696d8b50b6',
  },
  serverUrl: isDevMode ? 'http://localhost:8080' : 'https://simplehold.io/api',
  socketUrl: isDevMode ? 'http://localhost:8080' : 'wss://simplehold.io',
}
