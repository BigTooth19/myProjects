module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-extra-semi': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-irregular-whitespace': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    'array-element-newline': 'off',
    'array-bracket-newline': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
