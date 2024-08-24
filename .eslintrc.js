module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "no-console": "error",
    "comma-dangle": ["error", "never"],
    "@typescript-eslint/no-explicit-any": ["error"],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true,
      "allowHigherOrderFunctions": true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "eqeqeq": ["error", "always"],
    "no-return-await": "error",
    "no-implicit-coercion": "error",
    "no-var": "error",
    "no-unreachable": "error",
    "prefer-const": "error",
    "no-undef": "error",
    "@typescript-eslint/no-shadow": ["error"],
    "prefer-template": "error",
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
    "brace-style": ["error", "1tbs"],
    "curly": ["error", "multi-line"],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"]
  }
};
