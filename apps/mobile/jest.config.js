module.exports = {
  displayName: 'mobile',
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@pocketoo/domain$': '<rootDir>/../../packages/domain/src/index.ts',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};
