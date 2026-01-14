import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      // Relaxer no-explicit-any dans les fichiers UI (focus sur les vrais bugs)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Permet les apostrophes dans JSX (plus naturel en français)
      'react/no-unescaped-entities': 'off',
      // Autres règles utiles
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
    },
  },
])

export default eslintConfig
