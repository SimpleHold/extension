const isDevMode = process.env.NODE_ENV === 'development'

export default {
  apiKey: {
    amplitude: 'a9ef99a1f9f24a563cc32a696d8b50b6',
  },
  serverUrl: isDevMode ? 'http://localhost:8080' : 'https://simplehold.io/api',
}
