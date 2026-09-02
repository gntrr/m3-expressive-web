import { describe, expect, it } from 'vitest';

import {
  getMaterialShape,
  MATERIAL_EXPRESSIVE_SHAPE_NAMES,
  MATERIAL_SHAPE_CORNERS,
  MATERIAL_SHAPE_CORNER_ROLES,
  MATERIAL_SHAPE_SOURCE,
  materialShapeCornerToCssValue,
  materialShapeCornerToCssVariable,
  materialShapes,
  toMaterialShapeCss,
  toMaterialShapeCssVariables,
  toMaterialShapeSvgPath,
  type MaterialExpressiveShapeName,
} from './index.js';

describe('Material semantic corner roles', () => {
  it('defines the complete generated web corner vocabulary', () => {
    expect(MATERIAL_SHAPE_CORNER_ROLES).toHaveLength(15);
    expect(Object.keys(MATERIAL_SHAPE_CORNERS)).toEqual([
      ...MATERIAL_SHAPE_CORNER_ROLES,
    ]);
    expect(MATERIAL_SHAPE_CORNERS.none.corners.topStart).toBe('0px');
    expect(MATERIAL_SHAPE_CORNERS.extraSmall.corners.topStart).toBe('4px');
    expect(MATERIAL_SHAPE_CORNERS.small.corners.topStart).toBe('8px');
    expect(MATERIAL_SHAPE_CORNERS.medium.corners.topStart).toBe('12px');
    expect(MATERIAL_SHAPE_CORNERS.large.corners.topStart).toBe('16px');
    expect(MATERIAL_SHAPE_CORNERS.largeIncreased).toMatchObject({
      generation: 'expressive',
      classification: 'canonical',
      corners: { topStart: '20px' },
    });
    expect(MATERIAL_SHAPE_CORNERS.extraLarge.corners.topStart).toBe('28px');
    expect(MATERIAL_SHAPE_CORNERS.extraLargeIncreased.corners.topStart).toBe(
      '32px',
    );
    expect(MATERIAL_SHAPE_CORNERS.extraExtraLarge.corners.topStart).toBe('48px');
    expect(MATERIAL_SHAPE_CORNERS.full.corners.topStart).toBe('9999px');
  });

  it('preserves directional corner semantics in LTR and RTL', () => {
    expect(materialShapeCornerToCssValue('largeStart')).toBe('16px 0px 0px 16px');
    expect(
      materialShapeCornerToCssValue('largeStart', { direction: 'rtl' }),
    ).toBe('0px 16px 16px 0px');
    expect(materialShapeCornerToCssValue('largeEnd')).toBe('0px 16px 16px 0px');
    expect(
      materialShapeCornerToCssValue('largeEnd', { direction: 'rtl' }),
    ).toBe('16px 0px 0px 16px');
    expect(materialShapeCornerToCssValue('extraLargeTop', { direction: 'rtl' })).toBe(
      '28px 28px 0px 0px',
    );
  });

  it('serializes semantic custom properties and RTL overrides', () => {
    const variables = toMaterialShapeCssVariables();
    expect(Object.keys(variables)).toHaveLength(15);
    expect(materialShapeCornerToCssVariable('extraExtraLarge')).toBe(
      '--md-sys-shape-corner-extra-extra-large',
    );
    expect(variables['--md-sys-shape-corner-medium']).toBe('12px');
    expect(variables['--md-sys-shape-corner-full']).toBe('9999px');
    expect(Object.isFrozen(variables)).toBe(true);

    const css = toMaterialShapeCss({ selector: '[data-material-shape]' });
    expect(css).toContain('Material 3 shape 34.0.21; source c05b4b23485c803f68ff31cde52506cea5cc555a.');
    expect(css).toContain('[data-material-shape]:dir(rtl) {');
    expect(css).toContain('--md-sys-shape-corner-large-start: 0px 16px 16px 0px;');
    expect(css).toContain('--md-sys-shape-corner-large-end: 16px 0px 0px 16px;');
    expect(() => toMaterialShapeCss({ selector: ' ' })).toThrow(TypeError);
  });
});

describe('Material Expressive named geometry', () => {
  it('exposes all 35 official current names', () => {
    expect(MATERIAL_EXPRESSIVE_SHAPE_NAMES).toHaveLength(35);
    expect(Object.keys(materialShapes)).toEqual([...MATERIAL_EXPRESSIVE_SHAPE_NAMES]);
    expect(materialShapes.cookie4Sided).toBe(getMaterialShape('cookie4Sided'));
    expect(getMaterialShape('cookie4Sided')).toBe(getMaterialShape('cookie4Sided'));
  });

  it('normalizes every shape into a centered unit-square cubic path', () => {
    for (const name of MATERIAL_EXPRESSIVE_SHAPE_NAMES) {
      const geometry = getMaterialShape(name).geometry;
      const points = geometry.segments.flatMap((segment) => [
        segment.start,
        segment.control1,
        segment.control2,
        segment.end,
      ]);
      const xs = points.map((point) => point.x);
      const ys = points.map((point) => point.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      expect(minX).toBeGreaterThanOrEqual(0);
      expect(minY).toBeGreaterThanOrEqual(0);
      expect(maxX).toBeLessThanOrEqual(1);
      expect(maxY).toBeLessThanOrEqual(1);
      expect(Math.max(maxX - minX, maxY - minY)).toBeCloseTo(1, 8);
      expect(geometry.viewBox).toEqual([0, 0, 1, 1]);
      expect(geometry.closed).toBe(true);
      expect(geometry.classification).toBe('translated');

      for (let index = 0; index < geometry.segments.length; index += 1) {
        const segment = geometry.segments[index]!;
        const next = geometry.segments[(index + 1) % geometry.segments.length]!;
        expect(segment.end).toEqual(next.start);
      }
    }
  });

  it('keeps a deterministic translated geometry fingerprint', () => {
    const cookie = getMaterialShape('cookie4Sided');
    expect(cookie.androidName).toBe('Cookie4Sided');
    expect(cookie.stability).toBe('experimental');
    expect(cookie.classification).toEqual({
      definition: 'canonical',
      geometry: 'translated',
    });
    expect(cookie.geometry.segments).toHaveLength(17);
    expect(cookie.geometry.segments[0]!.start.x).toBeCloseTo(0.87136516, 8);
    expect(cookie.geometry.segments[0]!.start.y).toBeCloseTo(0.870775392, 8);
    expect(cookie.geometry.segments[1]!.start.x).toBeCloseTo(0.621977061, 8);
  });

  it('deep-freezes public shape output', () => {
    const shape = getMaterialShape('heart');
    expect(Object.isFrozen(materialShapes)).toBe(true);
    expect(Object.isFrozen(shape)).toBe(true);
    expect(Object.isFrozen(shape.classification)).toBe(true);
    expect(Object.isFrozen(shape.geometry)).toBe(true);
    expect(Object.isFrozen(shape.geometry.viewBox)).toBe(true);
    expect(Object.isFrozen(shape.geometry.segments)).toBe(true);
    expect(Object.isFrozen(shape.geometry.segments[0])).toBe(true);
    expect(Object.isFrozen(shape.geometry.segments[0]!.start)).toBe(true);
  });

  it('rejects names outside the authoritative vocabulary', () => {
    expect(() =>
      getMaterialShape('moon' as MaterialExpressiveShapeName),
    ).toThrow(RangeError);
  });
});

describe('Material shape SVG serialization and provenance', () => {
  it('serializes deterministic closed SVG paths without a renderer dependency', () => {
    const first = toMaterialShapeSvgPath(getMaterialShape('flower'));
    const second = toMaterialShapeSvgPath(materialShapes.flower);
    expect(first).toBe(second);
    expect(first).toMatch(/^M [\d.-]+ [\d.-]+ C /);
    expect(first).toMatch(/ Z$/);
    expect(first).not.toMatch(/NaN|Infinity/);
    expect(toMaterialShapeSvgPath(materialShapes.square, { precision: 3 })).not.toBe(
      toMaterialShapeSvgPath(materialShapes.square, { precision: 6 }),
    );
    expect(() =>
      toMaterialShapeSvgPath(materialShapes.square, { precision: 10 }),
    ).toThrow(RangeError);
  });

  it('pins source versions and classifications', () => {
    expect(MATERIAL_SHAPE_SOURCE).toMatchObject({
      webTokenVersion: '34.0.21',
      webSourceRevision: 'c05b4b23485c803f68ff31cde52506cea5cc555a',
      androidXSourceRevision: '9df4d001962d58aabca222967b8ceb1789acb960',
      androidXShapeTokenVersion: '14_1_0',
      expressiveApiStability: 'experimental',
      classifications: {
        cornerRoles: 'canonical',
        expressiveDefinitions: 'canonical',
        normalizedGeometry: 'translated',
        cssSerialization: 'translated',
        svgSerialization: 'translated',
        rtlSerialization: 'web-decision',
      },
    });
    expect(Object.isFrozen(MATERIAL_SHAPE_SOURCE)).toBe(true);
    expect(Object.isFrozen(MATERIAL_SHAPE_SOURCE.classifications)).toBe(true);
  });
});
