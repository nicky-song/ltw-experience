module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
        '!src/**/reportWebVitals.ts',
        '!src/constants/envVariables.ts',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    workerIdleMemoryLimit: 0.2,
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupFiles.ts'],
    extensionsToTreatAsEsm: ['.tsx', '.ts'],
    transform: {
        '^.+\\.ts?$': ['ts-jest'],
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass|svg)$': 'identity-obj-proxy',
        // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
        uuid: require.resolve('uuid'),
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    },
    testResultsProcessor: 'jest-sonar-reporter',
    modulePathIgnorePatterns: ['<rootDir>/e2e-tests/'],
};
