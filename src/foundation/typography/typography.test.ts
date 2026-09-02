import { describe, expect, it } from 'vitest';

import {
  createMaterialTypography,
  MATERIAL_EMPHASIZED_TYPE_SCALE,
  MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES,
  MATERIAL_RECOMMENDED_FONT_FAMILIES,
  MATERIAL_STANDARD_TYPE_SCALE,
  MATERIAL_TYPOGRAPHY_ROLES,
  MATERIAL_TYPOGRAPHY_SOURCE,
  materialTypographyRoleToCssVariable,
  toMaterialTypographyCss,
  toMaterialTypographyCssVariables,
} from './index.js';

describe('Material typography tokens', () => {
  it('defines the complete standard Material 3 type scale', () => {
    expect(MATERIAL_TYPOGRAPHY_ROLES).toHaveLength(15);
    expect(Object.keys(MATERIAL_STANDARD_TYPE_SCALE)).toEqual([
      ...MATERIAL_TYPOGRAPHY_ROLES,
    ]);
    expect(MATERIAL_STANDARD_TYPE_SCALE.displayLarge).toMatchObject({
      fontFamilyRole: 'brand',
      fontSize: '3.5625rem',
      lineHeight: '4rem',
      fontWeight: 400,
      letterSpacing: '-0.015625rem',
      classification: 'canonical',
    });
    expect(MATERIAL_STANDARD_TYPE_SCALE.bodyMedium).toMatchObject({
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: 400,
      letterSpacing: '0.015625rem',
    });
  });

  it('defines the complete authoritative static-font emphasized scale', () => {
    expect(MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES).toHaveLength(15);
    expect(Object.keys(MATERIAL_EMPHASIZED_TYPE_SCALE)).toEqual([
      ...MATERIAL_EMPHASIZED_TYPOGRAPHY_ROLES,
    ]);
    expect(MATERIAL_EMPHASIZED_TYPE_SCALE.displayLargeEmphasized).toMatchObject({
      fontSize: MATERIAL_STANDARD_TYPE_SCALE.displayLarge.fontSize,
      lineHeight: MATERIAL_STANDARD_TYPE_SCALE.displayLarge.lineHeight,
      fontWeight: 500,
    });
    expect(MATERIAL_EMPHASIZED_TYPE_SCALE.labelLargeEmphasized).toMatchObject({
      fontSize: MATERIAL_STANDARD_TYPE_SCALE.labelLarge.fontSize,
      lineHeight: MATERIAL_STANDARD_TYPE_SCALE.labelLarge.lineHeight,
      fontWeight: 700,
    });
  });

  it('uses scalable rem metrics rather than px values', () => {
    const definitions = [
      ...Object.values(MATERIAL_STANDARD_TYPE_SCALE),
      ...Object.values(MATERIAL_EMPHASIZED_TYPE_SCALE),
    ];

    for (const definition of definitions) {
      expect(definition.fontSize).toMatch(/^-?[\d.]+rem$/);
      expect(definition.lineHeight).toMatch(/^-?[\d.]+rem$/);
      expect(definition.letterSpacing).toMatch(/^-?[\d.]+rem$/);
      expect(`${definition.fontSize}${definition.lineHeight}`).not.toContain('px');
    }
  });
});

describe('createMaterialTypography', () => {
  it('is deterministic and includes pinned provenance', () => {
    const first = createMaterialTypography();
    const second = createMaterialTypography();

    expect(first).toEqual(second);
    expect(Object.keys(first.roles)).toHaveLength(30);
    expect(first.fontFamilies).toEqual(MATERIAL_RECOMMENDED_FONT_FAMILIES);
    expect(first.provenance).toBe(MATERIAL_TYPOGRAPHY_SOURCE);
    expect(first.provenance).toMatchObject({
      tokenVersion: '34.0.21',
      sourceRevision: 'c05b4b23485c803f68ff31cde52506cea5cc555a',
      androidXTokenVersion: 'v0_103',
      classifications: {
        standardMetrics: 'canonical',
        emphasizedMetrics: 'canonical',
        cssSerialization: 'translated',
        fontFamilies: 'web-decision',
        excludedAndroidEmphasizedMetrics: 'provisional',
      },
    });
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.roles)).toBe(true);
  });

  it('overrides families without changing the Material scale', () => {
    const baseline = createMaterialTypography();
    const customized = createMaterialTypography({
      fontFamilies: { brand: 'Roboto Flex, system-ui, sans-serif' },
    });

    expect(customized.fontFamilies).toEqual({
      brand: 'Roboto Flex, system-ui, sans-serif',
      plain: MATERIAL_RECOMMENDED_FONT_FAMILIES.plain,
    });
    expect(customized.roles.displayLarge.fontFamily).toBe(
      'Roboto Flex, system-ui, sans-serif',
    );
    expect(customized.roles.bodyLarge.fontFamily).toBe(
      MATERIAL_RECOMMENDED_FONT_FAMILIES.plain,
    );
    expect(customized.roles.displayLarge.fontSize).toBe(
      baseline.roles.displayLarge.fontSize,
    );
    expect(customized.roles.displayLarge.valueClassification.fontFamily).toBe(
      'web-decision',
    );
  });

  it('rejects empty font-family values', () => {
    expect(() =>
      createMaterialTypography({ fontFamilies: { brand: '   ' } }),
    ).toThrow(TypeError);
  });
});

describe('Material typography CSS', () => {
  it('maps standard and emphasized roles to semantic property names', () => {
    expect(materialTypographyRoleToCssVariable('displayLarge', 'lineHeight')).toBe(
      '--md-sys-typescale-display-large-line-height',
    );
    expect(
      materialTypographyRoleToCssVariable('labelSmallEmphasized', 'tracking'),
    ).toBe('--md-sys-typescale-emphasized-label-small-tracking');
  });

  it('serializes reference families and every role value deterministically', () => {
    const variables = toMaterialTypographyCssVariables(
      createMaterialTypography({
        fontFamilies: { plain: 'Atkinson Hyperlegible, sans-serif' },
      }),
    );

    expect(Object.keys(variables)).toHaveLength(152);
    expect(variables['--md-ref-typeface-brand']).toBe(
      MATERIAL_RECOMMENDED_FONT_FAMILIES.brand,
    );
    expect(variables['--md-ref-typeface-plain']).toBe(
      'Atkinson Hyperlegible, sans-serif',
    );
    expect(variables['--md-sys-typescale-body-large-font']).toBe(
      'var(--md-ref-typeface-plain)',
    );
    expect(variables['--md-sys-typescale-body-large-size']).toBe('1rem');
    expect(variables['--md-sys-typescale-body-large-weight']).toBe(400);
    expect(
      variables['--md-sys-typescale-emphasized-body-large-weight'],
    ).toBe(500);
    expect(Object.isFrozen(variables)).toBe(true);
  });

  it('creates a selectable CSS rule with source metadata', () => {
    const css = toMaterialTypographyCss(createMaterialTypography(), {
      selector: '[data-material-theme="editorial"]',
    });

    expect(css).toContain(
      'Material 3 typography 34.0.21; source c05b4b23485c803f68ff31cde52506cea5cc555a.',
    );
    expect(css).toContain('[data-material-theme="editorial"] {');
    expect(css).toContain('--md-sys-typescale-title-medium-size: 1rem;');
    expect(css).toContain(
      '--md-sys-typescale-emphasized-title-medium-weight: 700;',
    );
    expect(() =>
      toMaterialTypographyCss(createMaterialTypography(), { selector: ' ' }),
    ).toThrow(TypeError);
  });
});
