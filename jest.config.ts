import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    '^@/public/(.*)$': '<rootDir>/public/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    './**/*.{js,jsx,ts,tsx}',
    '!./**/_*.{js,jsx,ts,tsx}',
    '!./**/*.stories.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/'],
};

export default createJestConfig(config);
