import { defineConfig } from 'tsup';

const sourceEntries = [
  'src/**/*.{ts,tsx}',
  '!src/foundation/color/**',
  '!src/**/*.stories.{ts,tsx}',
  '!src/**/*.test.{ts,tsx}',
  '!src/testing/**',
];

const declarationEntries = {
  index: 'src/index.ts',
  'components/index': 'src/components/index.ts',
  'foundation/index': 'src/foundation/index.ts',
  'utilities/index': 'src/utilities/index.ts',
};

const sharedOptions = {
  format: 'esm' as const,
  target: 'es2022',
  platform: 'browser' as const,
  sourcemap: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
};

export default defineConfig([
  {
    ...sharedOptions,
    entry: [...sourceEntries, 'src/styles/**/*.css'],
    bundle: false,
    splitting: false,
    clean: true,
    dts: {
      entry: declarationEntries,
    },
    loader: {
      '.css': 'css',
    },
  },
  {
    ...sharedOptions,
    entry: {
      'foundation/color/index': 'src/foundation/color/index.ts',
    },
    bundle: true,
    splitting: false,
    clean: false,
    dts: false,
    noExternal: ['@material/material-color-utilities'],
  },
]);
