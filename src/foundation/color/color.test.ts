import { describe, expect, it } from 'vitest';

import {
  MATERIAL_COLOR_ROLES,
  MATERIAL_COLOR_SOURCE,
  MATERIAL_TONES,
  createMaterialColorScheme,
  materialColorRoleToCssVariable,
  toMaterialColorCss,
  toMaterialColorCssVariables,
} from './index.js';

const INPUT = {
  seed: '#6750A4',
  variant: 'tonalSpot',
  contrastLevel: 0,
  mode: 'light',
} as const;

describe('createMaterialColorScheme', () => {
  it('is deterministic for identical inputs', () => {
    const first = createMaterialColorScheme(INPUT);
    const second = createMaterialColorScheme(INPUT);

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });

  it('pins representative 2025 semantic role output', () => {
    const scheme = createMaterialColorScheme(INPUT);

    expect(scheme.roles).toMatchObject({
      primary: '#655789',
      onPrimary: '#fdf7ff',
      primaryContainer: '#d4c3fd',
      onPrimaryContainer: '#493c6c',
      surface: '#fdf7fe',
      onSurface: '#34313a',
      outline: '#7d7983',
    });
    expect(scheme.palettes.primary[40]).toBe('#645788');
    expect(Object.keys(scheme.roles)).toEqual([...MATERIAL_COLOR_ROLES]);
    expect(Object.keys(scheme.palettes.primary).map(Number)).toEqual([
      ...MATERIAL_TONES,
    ]);
  });

  it('generates a distinct dark scheme from the same source inputs', () => {
    const scheme = createMaterialColorScheme({ ...INPUT, mode: 'dark' });

    expect(scheme.roles).toMatchObject({
      primary: '#cdc0ec',
      onPrimary: '#443a5f',
      primaryContainer: '#574d72',
      onPrimaryContainer: '#e9deff',
      surface: '#0f0d12',
      onSurface: '#eae3ef',
      outline: '#78737e',
    });
    expect(scheme.roles).not.toEqual(createMaterialColorScheme(INPUT).roles);
  });

  it('normalizes seeds and preserves exact provenance', () => {
    const scheme = createMaterialColorScheme({ ...INPUT, seed: '#A5C' });

    expect(scheme.provenance).toEqual({
      ...MATERIAL_COLOR_SOURCE,
      seed: '#aa55cc',
      variant: 'tonalSpot',
      contrastLevel: 0,
      mode: 'light',
    });
    expect(Object.isFrozen(scheme)).toBe(true);
    expect(Object.isFrozen(scheme.roles)).toBe(true);
    expect(Object.isFrozen(scheme.palettes.primary)).toBe(true);
  });

  it('rejects ambiguous seeds and out-of-range contrast', () => {
    expect(() => createMaterialColorScheme({ ...INPUT, seed: '6750A4' })).toThrow(
      /#RGB or #RRGGBB/,
    );
    expect(() => createMaterialColorScheme({ ...INPUT, seed: '#6750A4FF' })).toThrow(
      /#RGB or #RRGGBB/,
    );
    expect(() =>
      createMaterialColorScheme({ ...INPUT, contrastLevel: 1.01 }),
    ).toThrow(/-1 to 1/);
    expect(() =>
      createMaterialColorScheme({ ...INPUT, contrastLevel: Number.NaN }),
    ).toThrow(/finite/);
  });
});

describe('Material color CSS output', () => {
  it('maps camelCase roles to Material CSS custom properties', () => {
    expect(materialColorRoleToCssVariable('onPrimaryContainer')).toBe(
      '--md-sys-color-on-primary-container',
    );
    expect(materialColorRoleToCssVariable('surfaceContainerHighest')).toBe(
      '--md-sys-color-surface-container-highest',
    );
  });

  it('emits every semantic role as a CSS variable', () => {
    const scheme = createMaterialColorScheme(INPUT);
    const variables = toMaterialColorCssVariables(scheme);

    expect(Object.keys(variables)).toHaveLength(MATERIAL_COLOR_ROLES.length);
    expect(variables['--md-sys-color-primary']).toBe(scheme.roles.primary);
    expect(variables['--md-sys-color-on-surface']).toBe(scheme.roles.onSurface);
  });

  it('serializes scoped CSS with provenance', () => {
    const scheme = createMaterialColorScheme(INPUT);
    const css = toMaterialColorCss(scheme, { selector: '[data-theme="material"]' });

    expect(css).toContain('@material/material-color-utilities@0.4.0');
    expect(css).toContain(MATERIAL_COLOR_SOURCE.sourceRevision);
    expect(css).toContain('Material color spec: 2025; model: phone');
    expect(css).toContain('[data-theme="material"] {');
    expect(css).toContain('  --md-sys-color-primary: #655789;');
    expect(css.endsWith('\n')).toBe(true);
  });

  it('rejects an empty CSS selector', () => {
    expect(() =>
      toMaterialColorCss(createMaterialColorScheme(INPUT), { selector: '  ' }),
    ).toThrow(/must not be empty/);
  });
});
