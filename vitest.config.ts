import path from 'node:path';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  // MCU 0.4.0 contains extensionless internal ESM imports. Let Vite resolve and
  // transform the pinned package instead of handing those imports to Node.
  ssr: {
    noExternal: ['@material/material-color-utilities'],
  },
  test: {
    passWithNoTests: true,
    projects: [
      {
        ssr: {
          noExternal: ['@material/material-color-utilities'],
        },
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.stories.{ts,tsx}'],
          setupFiles: ['./src/testing/setup.ts'],
        },
      },
      {
        extends: true,
        optimizeDeps: {
          // Storybook's browser setup reaches this CommonJS package through an
          // ESM dependency. Prebundle the nested dependency for native ESM.
          include: [
            'storybook/test',
            '@testing-library/dom',
            '@testing-library/dom > aria-query',
            '@testing-library/dom > lz-string',
          ],
        },
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
