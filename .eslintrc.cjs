module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react-hooks'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    env: {
        browser: true,
        es2023: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: ['dist', 'node_modules'],
}
