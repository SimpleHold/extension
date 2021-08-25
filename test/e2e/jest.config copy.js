module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/specs/*.ts'],
  globalSetup: '<rootDir>/setup.js',
  globalTeardown: '<rootDir>/teardown.js',
  testEnvironment: '<rootDir>/puppeteer_environment.js',
}
