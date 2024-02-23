module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended'
  ],
  "rules": {
    // disable the rule for all files
    "@typescript-eslint/explicit-function-return-type": "off",
  },
}
