module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        '{types,features,hooks,utils}/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
        '!src/**/reportWebVitals.ts',
        '!src/constants/envVariables.ts',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    workerIdleMemoryLimit: 0.2,
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
    extensionsToTreatAsEsm: ['.tsx', '.ts'],
    transform: {
        '^.+\\.ts?$': ['ts-jest'],
    },
    testResultsProcessor: 'jest-sonar-reporter',
    modulePathIgnorePatterns: ['<rootDir>/e2e-tests/'],
};
