/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/application/use-cases/*.use-case.ts',
    'src/**/application/helpers/*.ts',
    'src/**/application/presenters/*.ts',
    'src/**/domain/entities/*.entity.ts',
    'src/common/authentication/authentication.service.ts',
    'src/common/authentication/guards/**/*.ts',
    'src/common/authorization/*.ts',
    'src/common/http/app-http.exception.ts',
    'src/common/http/error-response.ts',
    'src/common/http/success-response.ts',
    'src/utils/*.ts',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['\\.d\\.ts$'],
  coverageProvider: 'babel',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    'src/**/application/use-cases/*.use-case.ts': {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/common/authentication/authentication.service.ts': {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/common/authentication/guards/**/*.ts': {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  roots: ['<rootDir>/test/unit'],
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            decorators: true,
            syntax: 'typescript',
          },
          target: 'es2022',
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true,
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
};
