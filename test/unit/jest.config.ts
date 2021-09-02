export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/specs/*.ts'],
  verbose: true,
  rootDir: './../../',
  moduleNameMapper: {
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@config/(.*)': '<rootDir>/src/config/$1',
    '^@assets/(.*)': '<rootDir>/src/assets/$1',
    '@emurgo/cardano-serialization-lib-browser': '<rootDir>/test/unit/utils/svgTransform.js',
  },
  transform: {
    '^.+\\.svg$': '<rootDir>/test/unit/utils/svgTransform.js',
  },
  globals: {
    'bitcore-lib': require('../../src/scripts/bitcore-lib.min.js'),
    bitcoin: require('../../src/scripts/bitcoin'),
  },
}
