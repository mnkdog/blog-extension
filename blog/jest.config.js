const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node', // Use node for file system tests
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: false }]
  }
}

module.exports = createJestConfig(customJestConfig)
