export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  preset: 'jest-puppeteer',
  globals: {
    URL: 'http://localhost:8080',
  },
  verbose: true,
  transform: { '\\.ts$': ['ts-jest'] },
}
