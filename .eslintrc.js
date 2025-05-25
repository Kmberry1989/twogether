module.exports = {
root: true,
extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
parser: '@typescript-eslint/parser',
plugins: ['@typescript-eslint'],
env: { 'react-native/react-native': true },
rules: {}
};
