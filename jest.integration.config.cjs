const unitConfig = require('./jest.config.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...unitConfig,
  collectCoverage: false,
  collectCoverageFrom: [],
  coverageThreshold: undefined,
  roots: ['<rootDir>/test/integration'],
  testMatch: ['**/*.integration-spec.ts'],
  testTimeout: 30_000,
};
