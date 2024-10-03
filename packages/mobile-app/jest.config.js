module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        './setupJest.js',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!./index.js',
        '!*.config.js',
        '!**/coverage/**',
        '!./android/**',
        '!**/node_modules/**',
        '!**/babel.config.js',
        '!**/jest.setup.js',
    ],
    testResultsProcessor: 'jest-sonar-reporter',
};
