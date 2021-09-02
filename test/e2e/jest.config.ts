export default {
  clearMocks: true,
  transform: {
    '^.+\\.(js|ts|tsx)$': 'ts-jest',
  },
  rootDir: './../../',
  testMatch: ['**/specs/*.spec.tsx'],
  setupFiles: ['<rootDir>/test/e2e/utils/test-setup.ts'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@components/(.*)': '<rootDir>/src/components/$1',
  },
}
