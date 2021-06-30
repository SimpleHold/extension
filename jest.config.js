module.exports = {
  roots: ['<rootDir>/src/__tests__'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.(png|svg)$': '<rootDir>/svgTransform.js',
  },
  preset: 'jest-puppeteer',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@config/(.*)': '<rootDir>/src/config/$1',
    '^@components/(.*)': '<rootDir>/src/components/$1',
    '^@pages/(.*)': '<rootDir>/src/pages/$1',
    '^@assets/(.*)': '<rootDir>/src/assets/$1',
    '^@drawers/(.*)': '<rootDir>/src/drawers/$1',
    '^@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '^@contexts/(.*)': '<rootDir>/src/contexts/$1',
  },
}
