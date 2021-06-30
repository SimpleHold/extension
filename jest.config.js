module.exports = {
  roots: ['<rootDir>/src/__tests__'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@config/(.*)': '<rootDir>/src/config/$1',
    '^@components/(.*)': '<rootDir>/src/components/$1',
  },
}
