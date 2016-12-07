module.exports = {
  extends: 'airbnb-base',
  env: {
    'node': true,
  },
  root: true,
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    }],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'max-len': ['error', 120, 4, {'ignoreComments': true, 'ignoreUrls': true}],
    'no-unused-vars': ['error', {'vars': 'all', 'args': 'none'}],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-warning-comments': ['warn', { 'terms': ['fixme'], 'location': 'start' }],

    // NOTE: Disabled to not do too many changes to original codebase:
    'consistent-return': 'off',
    'arrow-body-style': 'off',
    'object-curly-spacing': 'off',
    'padded-blocks': 'off',
    'arrow-parens': 'off',
    'import/extensions': 'off',
    'no-shadow': 'off',
    'array-callback-return': 'off',
    'no-else-return': 'off',
  }
}
