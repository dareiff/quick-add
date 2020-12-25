module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'prettier',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['prettier', 'react', '@typescript-eslint'],
    rules: {
        'comma-dangle': [0],
        'prettier/prettier': ['error'],
        'react/jsx-indent': [1],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'sort-keys': [1],
        'sort-vars': [1],
    },
};
