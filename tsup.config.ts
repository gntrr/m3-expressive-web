import { defineConfig } from 'tsup';

const sourceEntries = [
  'src/**/*.{ts,tsx}',
  '!src/foundation/color/create-material-color-scheme.ts',
  '!src/foundation/color/generator.ts',
  '!src/**/*.stories.{ts,tsx}',
  '!src/**/*.test.{ts,tsx}',
  '!src/testing/**',
];

const declarationEntries = {
  index: 'src/index.ts',
  'components/index': 'src/components/index.ts',
  'components/button/index': 'src/components/button/index.ts',
  'foundation/index': 'src/foundation/index.ts',
  'foundation/adaptive-layout/index': 'src/foundation/adaptive-layout/index.ts',
  'foundation/color/index': 'src/foundation/color/index.ts',
  'foundation/color/generator': 'src/foundation/color/generator.ts',
  'foundation/elevation/index': 'src/foundation/elevation/index.ts',
  'foundation/motion/index': 'src/foundation/motion/index.ts',
  'foundation/shape/index': 'src/foundation/shape/index.ts',
  'foundation/state/index': 'src/foundation/state/index.ts',
  'foundation/typography/index': 'src/foundation/typography/index.ts',
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
    entry: [
      ...sourceEntries,
      'src/styles/**/*.css',
      'src/components/**/*.css',
      '!src/**/*.stories.css',
    ],
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
      'foundation/color/generator': 'src/foundation/color/generator.ts',
    },
    bundle: true,
    splitting: false,
    clean: false,
    dts: false,
    noExternal: ['@material/material-color-utilities'],
  },
]);
