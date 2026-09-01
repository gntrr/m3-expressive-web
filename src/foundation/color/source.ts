import type { MaterialColorSource } from './types.js';

/**
 * Exact generator provenance. Update this atomically with package.json,
 * bun.lock, golden tests, and the color foundation documentation.
 */
export const MATERIAL_COLOR_SOURCE = Object.freeze({
  packageName: '@material/material-color-utilities',
  packageVersion: '0.4.0',
  packageIntegrity:
    'sha512-dlq6VExJReb8dhjj3a/yTigr3ncNwoFmL5Iy2ENtbDX03EmNeOEdZ+vsaGrj7RTuO+mB7L58II4LCsl4NpM8uw==',
  sourceRepository:
    'https://github.com/material-foundation/material-color-utilities',
  sourceRevision: 'eeaf82b8e11bf20f6d8da7c76336575b69e79e01',
  materialSpecVersion: '2025',
  materialPlatform: 'phone',
} satisfies MaterialColorSource);
