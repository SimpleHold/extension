/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/specs/*.ts'],
  verbose: true,
  rootDir: './../../',
  moduleNameMapper: {
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@config/(.*)': '<rootDir>/src/config/$1',
    '^@assets/(.*)': '<rootDir>/src/assets/$1',
    '@emurgo/cardano-serialization-lib-browser': '<rootDir>/tests/unit/svgTransform.js',
  },
  transform: {
    '^.+\\.svg$': '<rootDir>/tests/unit/svgTransform.js',
  },
  globals: {
    'bitcore-lib': require('../../src/scripts/bitcore-lib.min.js'),
    bitcoin: require('../../src/scripts/bitcoin'),
  },
}
