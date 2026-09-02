import { describe, expect, it } from 'vitest';

import {
  MATERIAL_ELEVATION_LEVEL_NAMES,
  MATERIAL_ELEVATION_SOURCE,
  materialElevation,
  materialElevationLevelToCssVariable,
  materialElevationShadows,
  materialElevationShadowToCssValue,
  toMaterialElevationCss,
  toMaterialElevationCssVariables,
  toMaterialElevationShadowCssVariables,
} from './index.js';

describe('Material elevation levels', () => {
  it('preserves semantic web levels and canonical reference distances', () => {
    expect(MATERIAL_ELEVATION_LEVEL_NAMES).toEqual([
      'level0',
      'level1',
      'level2',
      'level3',
      'level4',
      'level5',
    ]);
    expect(Object.values(materialElevation).map(({ webLevel }) => webLevel)).toEqual([
      0, 1, 2, 3, 4, 5,
    ]);
    expect(
      Object.values(materialElevation).map(({ referenceDp }) => referenceDp),
    ).toEqual([0, 1, 3, 6, 8, 12]);
    expect(materialElevation.level3).toEqual({
      name: 'level3',
      webLevel: 3,
      referenceDp: 6,
      classification: 'canonical',
    });
  });

  it('keeps elevation and official web shadow layers independent', () => {
    expect(materialElevationShadows.level5).toMatchObject({
      level: 'level5',
      key: { x: '0px', y: '4px', blur: '4px', spread: '0px', opacity: 0.3 },
      ambient: {
        x: '0px',
        y: '8px',
        blur: '12px',
        spread: '6px',
        opacity: 0.15,
      },
      classification: {
        layers: 'canonical',
        boxShadowSerialization: 'translated',
      },
    });
  });

  it('deep-freezes public token data', () => {
    expect(Object.isFrozen(materialElevation)).toBe(true);
    expect(Object.isFrozen(materialElevation.level1)).toBe(true);
    expect(Object.isFrozen(materialElevationShadows)).toBe(true);
    expect(Object.isFrozen(materialElevationShadows.level1)).toBe(true);
    expect(Object.isFrozen(materialElevationShadows.level1.key)).toBe(true);
    expect(Object.isFrozen(materialElevationShadows.level1.classification)).toBe(true);
  });
});

describe('Material elevation CSS', () => {
  it('serializes official web level inputs to semantic variables', () => {
    const variables = toMaterialElevationCssVariables();
    expect(Object.keys(variables)).toHaveLength(6);
    expect(materialElevationLevelToCssVariable('level2')).toBe(
      '--md-sys-elevation-level2',
    );
    expect(variables['--md-sys-elevation-level2']).toBe(2);
    expect(variables['--md-sys-elevation-level5']).toBe(5);
    expect(Object.isFrozen(variables)).toBe(true);
  });

  it('deterministically translates the official key and ambient layers', () => {
    expect(materialElevationShadowToCssValue('level0')).toBe('none');
    expect(
      materialElevationShadowToCssValue('level1', { shadowColor: '#000' }),
    ).toBe(
      '0px 1px 2px 0px color-mix(in srgb, #000 30%, transparent), ' +
        '0px 1px 3px 1px color-mix(in srgb, #000 15%, transparent)',
    );

    const variables = toMaterialElevationShadowCssVariables({
      shadowColor: 'rgb(10 20 30)',
    });
    expect(variables['--md-web-elevation-shadow-level3']).toContain(
      '0px 4px 8px 3px color-mix(in srgb, rgb(10 20 30) 15%, transparent)',
    );
    expect(Object.isFrozen(variables)).toBe(true);
    expect(() =>
      materialElevationShadowToCssValue('level1', {
        shadowColor: 'black; color: red',
      }),
    ).toThrow(TypeError);
  });

  it('emits traceable CSS with optional shadow translations', () => {
    const css = toMaterialElevationCss({ selector: '[data-material-theme]' });
    expect(css).toContain(
      'Material 3 elevation v0.192; source c05b4b23485c803f68ff31cde52506cea5cc555a.',
    );
    expect(css).toContain('[data-material-theme] {');
    expect(css).toContain('--md-sys-elevation-level4: 4;');
    expect(css).toContain('--md-web-elevation-shadow-level4:');

    const levelsOnly = toMaterialElevationCss({ includeShadows: false });
    expect(levelsOnly).not.toContain('--md-web-elevation-shadow-');
    expect(() => toMaterialElevationCss({ selector: ' ' })).toThrow(TypeError);
  });
});

describe('Material elevation provenance', () => {
  it('pins authoritative sources and keeps tonal elevation separate', () => {
    expect(MATERIAL_ELEVATION_SOURCE).toMatchObject({
      expressiveScale: 'none-documented',
      materialWebSourceRevision: 'c05b4b23485c803f68ff31cde52506cea5cc555a',
      materialWebTokenVersion: 'v0.192',
      androidXSourceRevision: '9df4d001962d58aabca222967b8ceb1789acb960',
      androidXTokenVersion: 'v0_103',
      tonalElevationPolicy: {
        implemented: false,
        classification: 'web-decision',
        treatment: 'separate-color-treatment',
      },
      classifications: {
        levelNames: 'canonical',
        webLevels: 'canonical',
        referenceDp: 'canonical',
        shadowLayers: 'canonical',
        cssLevelSerialization: 'translated',
        cssShadowSerialization: 'translated',
      },
    });
    expect(Object.isFrozen(MATERIAL_ELEVATION_SOURCE)).toBe(true);
    expect(Object.isFrozen(MATERIAL_ELEVATION_SOURCE.tonalElevationPolicy)).toBe(true);
    expect(Object.isFrozen(MATERIAL_ELEVATION_SOURCE.classifications)).toBe(true);
  });
});
