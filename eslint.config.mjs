import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import eslintPluginImport from 'eslint-plugin-import';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    plugins: {
      '@stylistic/js': stylisticJs,
      '@stylistic/jsx': stylisticJsx,
      'import': eslintPluginImport,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["src/**/*.jsx", "src/**/*.js"],
    rules: {
      'react/prop-types': 0,
      '@stylistic/js/semi': ["error", "always"],
      '@stylistic/js/array-bracket-spacing': ["error", "always"],
      '@stylistic/js/quotes': ["error", "single"],
      '@stylistic/js/arrow-spacing': "error",
      '@stylistic/js/block-spacing': "error",
      '@stylistic/js/comma-spacing': ["error", { "before": false, "after": true }],
      '@stylistic/js/computed-property-spacing': ["error", "never"],
      '@stylistic/js/function-call-spacing': ["error", "never"],
      '@stylistic/js/no-mixed-spaces-and-tabs': "error",
      '@stylistic/js/no-multi-spaces': ["error", { ignoreEOLComments: false }],
      '@stylistic/js/rest-spread-spacing': ["error", "never"],
      '@stylistic/js/space-before-blocks': "error",
      '@stylistic/js/eol-last': ["error", "always"],
      '@stylistic/js/max-len': ["error", { "code": 120, "ignoreStrings": true }],
      '@stylistic/js/quote-props': ["error", "as-needed"],
      'indent': ['error', 2],
      "@stylistic/jsx/jsx-closing-bracket-location": 1,
      '@stylistic/jsx/jsx-indent': [2, 2, { indentLogicalExpressions: true }],
      "@stylistic/jsx/jsx-indent-props": [2, 2],
      "@stylistic/jsx/jsx-first-prop-new-line": [2, 'multiline'],
      "@stylistic/jsx/jsx-max-props-per-line": [2, { maximum: { single: 3, multi: 1 } }],
      '@stylistic/jsx/jsx-tag-spacing': ["error", { "beforeSelfClosing": "always" }],
      '@stylistic/js/jsx-quotes': ["error", "prefer-double"],
      "arrow-body-style": ["warn", "as-needed", { "requireReturnForObjectLiteral": true }],
      "import/newline-after-import":[ "error", { exactCount: true }],
    }
  },
  {
    files: [ "src/**/*.test.*(js|jsx)" ],
    languageOptions: {
      globals: {
          ...globals.jest
      }
    }
  }
];