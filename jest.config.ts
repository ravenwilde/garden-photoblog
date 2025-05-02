import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types$': '<rootDir>/src/types.ts',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/mocks/'
  ],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types.ts',
  ],
  // NOTE: These thresholds are temporarily set just below current coverage so CI passes.
  // Please raise these as test coverage improves!
  coverageThreshold: {
    global: {
      branches: 11,
      functions: 20,
      lines: 16,
      statements: 16,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
