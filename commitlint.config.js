module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: {
        parserOpts: {
            issuePrefixes: ['L2WIN-'],
        },
    },
    formatter: '@commitlint/format',
    rules: {
        'scope-case': [2, 'always', 'start-case'],
        'subject-case': [2, 'always', 'sentence-case'],
        'references-empty': [2, 'never'],
    },
    ignores: [(commit) => commit === ''],
    defaultIgnores: true,
};
