// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

// eslint-config-next already registers eslint-plugin-jsx-a11y and its recommended
// rules, so we do not re-register the plugin here (that throws "Cannot redefine
// plugin"); we tighten a couple of rules from error-severity below instead.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      // Type-only imports/exports are erased at compile time — keeps builds fast
      // and works with verbatimModuleSyntax.
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      // Record<string, T> over {[key: string]: T}
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      // Throw/reject only Error instances.
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
    },
  },
  {
    rules: {
      'no-console': 'error',
      // Every switch has a default; non-empty cases must terminate.
      'default-case': 'error',
      'no-fallthrough': 'error',
      // const enum breaks isolatedModules; use a string literal union instead.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration[const=true]',
          message: 'const enum is banned — use a string literal union.',
        },
      ],
    },
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'storybook-static/**',
    'next-env.d.ts',
  ]),
  ...storybook.configs['flat/recommended'],
])

export default eslintConfig
