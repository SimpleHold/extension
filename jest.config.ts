export default {
  clearMocks: true,
  transform: {
    '^.+\\.(js|ts|tsx)$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/test-setup.ts'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
}
