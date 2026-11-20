import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/.expo/',
    '**/coverage/',
    '.claude/',
    '.agents/',
    'docs/',
    'scripts/',
    'functions/lib/',
  ]),
  { files: ['**/*.{ts,tsx}'], extends: [tseslint.configs.recommended] },
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
  },
  { files: ['**/*.config.js'], languageOptions: { sourceType: 'commonjs' } },
);
