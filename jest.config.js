export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!**/node_modules/**',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.test-output/'],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  testTimeout: 120000,
  // Run all tests sequentially — integration tests create/delete dirs and conflict when parallel
  maxWorkers: 1,
};
