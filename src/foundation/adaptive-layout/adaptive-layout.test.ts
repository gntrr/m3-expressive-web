import { describe, expect, it } from 'vitest';

import {
  MATERIAL_ADAPTIVE_LAYOUT_SOURCE,
  MATERIAL_ADAPTIVE_LAYOUT_WEB_POLICY,
  MATERIAL_ADAPTIVE_NAVIGATION_POLICY,
  MATERIAL_CANONICAL_LAYOUT_NAMES,
  MATERIAL_HEIGHT_CLASS_NAMES,
  MATERIAL_LAYOUT_QUERY_POLICY,
  MATERIAL_LAYOUT_WEB_TRANSLATION_POLICY,
  MATERIAL_WIDTH_CLASS_NAMES,
  MATERIAL_WINDOW_SIZE_CLASS_MODELS,
  getMaterialHeightClassMediaQuery,
  getMaterialWidthClassContainerQuery,
  getMaterialWidthClassMediaQuery,
  materialCanonicalLayouts,
  materialContainerQueries,
  materialLayoutBreakpointToCssVariable,
  materialMediaQueries,
  materialWindowSizeClasses,
  resolveMaterialHeightClass,
  resolveMaterialWidthClass,
  resolveMaterialWindowSizeClass,
  toMaterialAdaptiveLayoutCss,
  toMaterialAdaptiveLayoutCssVariables,
} from './index.js';

describe('Material window size classes', () => {
  it('preserves the canonical five-class width model', () => {
    expect(MATERIAL_WIDTH_CLASS_NAMES).toEqual([
      'compact',
      'medium',
      'expanded',
      'large',
      'extraLarge',
    ]);
    expect(Object.values(materialWindowSizeClasses.width).map(({ minDp }) => minDp)).toEqual([
      0, 600, 840, 1200, 1600,
    ]);
    expect(materialWindowSizeClasses.width.expanded).toEqual({
      name: 'expanded',
      axis: 'width',
      minDp: 840,
      maxExclusiveDp: 1200,
      classification: 'canonical',
    });
    expect(materialWindowSizeClasses.width.extraLarge.maxExclusiveDp).toBeNull();
  });

  it('preserves height as a separate three-class axis', () => {
    expect(MATERIAL_HEIGHT_CLASS_NAMES).toEqual(['compact', 'medium', 'expanded']);
    expect(Object.values(materialWindowSizeClasses.height).map(({ minDp }) => minDp)).toEqual([
      0, 480, 900,
    ]);
    expect(materialWindowSizeClasses.height.medium.maxExclusiveDp).toBe(900);
  });

  it('keeps BREAKPOINTS_V1 and BREAKPOINTS_V2 distinct', () => {
    expect(MATERIAL_WINDOW_SIZE_CLASS_MODELS.legacy).toMatchObject({
      name: 'v1-three-width-classes',
      status: 'legacy',
      androidXField: 'BREAKPOINTS_V1',
      widthClasses: ['compact', 'medium', 'expanded'],
    });
    expect(MATERIAL_WINDOW_SIZE_CLASS_MODELS.current).toMatchObject({
      name: 'v2-five-width-classes',
      status: 'current',
      androidXField: 'BREAKPOINTS_V2',
      widthClasses: ['compact', 'medium', 'expanded', 'large', 'extraLarge'],
    });
  });
});

describe('Material window class resolution', () => {
  it.each([
    [0, 'compact'],
    [599.999, 'compact'],
    [600, 'medium'],
    [600.001, 'medium'],
    [839.999, 'medium'],
    [840, 'expanded'],
    [840.001, 'expanded'],
    [1199.999, 'expanded'],
    [1200, 'large'],
    [1200.001, 'large'],
    [1599.999, 'large'],
    [1600, 'extraLarge'],
    [1600.001, 'extraLarge'],
  ] as const)('resolves width %s to %s', (width, expected) => {
    expect(resolveMaterialWidthClass(width)).toBe(expected);
  });

  it.each([
    [0, 'compact'],
    [479.999, 'compact'],
    [480, 'medium'],
    [480.001, 'medium'],
    [899.999, 'medium'],
    [900, 'expanded'],
    [900.001, 'expanded'],
  ] as const)('resolves height %s to %s', (height, expected) => {
    expect(resolveMaterialHeightClass(height)).toBe(expected);
  });

  it('resolves and freezes both axes without device categories', () => {
    const resolved = resolveMaterialWindowSizeClass(1280, 720);
    expect(resolved).toEqual({
      width: 'large',
      height: 'medium',
      availableCssPx: { width: 1280, height: 720 },
      classification: 'translated',
    });
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(resolved.availableCssPx)).toBe(true);
  });

  it('rejects negative and non-finite values', () => {
    expect(() => resolveMaterialWidthClass(-1)).toThrow(RangeError);
    expect(() => resolveMaterialWidthClass(Number.NaN)).toThrow(RangeError);
    expect(() => resolveMaterialHeightClass(Number.POSITIVE_INFINITY)).toThrow(
      RangeError,
    );
  });
});

describe('Material adaptive layout queries and CSS', () => {
  it('serializes exact Level 4 media-query ranges', () => {
    expect(getMaterialWidthClassMediaQuery('compact')).toBe('(width < 600px)');
    expect(getMaterialWidthClassMediaQuery('medium')).toBe(
      '(600px <= width < 840px)',
    );
    expect(getMaterialWidthClassMediaQuery('large')).toBe(
      '(1200px <= width < 1600px)',
    );
    expect(getMaterialWidthClassMediaQuery('extraLarge')).toBe(
      '(width >= 1600px)',
    );
    expect(getMaterialHeightClassMediaQuery('medium')).toBe(
      '(480px <= height < 900px)',
    );
  });

  it('uses logical inline-size for container queries', () => {
    expect(getMaterialWidthClassContainerQuery('expanded')).toBe(
      '(840px <= inline-size < 1200px)',
    );
    expect(materialContainerQueries.width.extraLarge).toBe(
      '(inline-size >= 1600px)',
    );
    expect(materialMediaQueries.width.medium).toBe(
      '(600px <= width < 840px)',
    );
  });

  it('emits only translated lower-bound reference variables', () => {
    const variables = toMaterialAdaptiveLayoutCssVariables();
    expect(variables).toEqual({
      '--md-web-layout-breakpoint-width-compact': '0px',
      '--md-web-layout-breakpoint-width-medium': '600px',
      '--md-web-layout-breakpoint-width-expanded': '840px',
      '--md-web-layout-breakpoint-width-large': '1200px',
      '--md-web-layout-breakpoint-width-extra-large': '1600px',
      '--md-web-layout-breakpoint-height-compact': '0px',
      '--md-web-layout-breakpoint-height-medium': '480px',
      '--md-web-layout-breakpoint-height-expanded': '900px',
    });
    expect(materialLayoutBreakpointToCssVariable('width', 'extraLarge')).toBe(
      '--md-web-layout-breakpoint-width-extra-large',
    );
    expect(Object.isFrozen(variables)).toBe(true);
  });

  it('emits deterministic traceable CSS and validates selectors', () => {
    const css = toMaterialAdaptiveLayoutCss({ selector: '[data-material-layout]' });
    expect(css).toContain(
      'AndroidX source c39790fae05be897dc522b3710db07d44d54f4d0.',
    );
    expect(css).toContain('[data-material-layout] {');
    expect(css).toContain('--md-web-layout-breakpoint-width-large: 1200px;');
    expect(() => toMaterialAdaptiveLayoutCss({ selector: ' ' })).toThrow(TypeError);
  });
});

describe('Material adaptive layout policies and provenance', () => {
  it('preserves the three canonical layout relationships', () => {
    expect(MATERIAL_CANONICAL_LAYOUT_NAMES).toEqual([
      'feed',
      'listDetail',
      'supportingPane',
    ]);
    expect(materialCanonicalLayouts.listDetail).toMatchObject({
      relationship: 'list-to-independent-detail',
      compact: 'one pane at a time',
      medium: 'one pane at a time',
      expandedAndAbove: 'list and detail panes side by side; optional extra pane',
      classification: 'canonical',
    });
    expect(materialCanonicalLayouts.supportingPane.relationship).toBe(
      'primary-to-dependent-support',
    );
  });

  it('keeps current and legacy navigation guidance distinct', () => {
    expect(MATERIAL_ADAPTIVE_NAVIGATION_POLICY).toMatchObject({
      currentDefault: {
        compactWidth: 'bottom-navigation',
        compactHeightOrTabletop: 'bottom-navigation',
        otherwise: 'side-navigation',
        classification: 'translated',
      },
      drawer: {
        automaticAtExpandedWidth: false,
        classification: 'web-decision',
      },
      legacySimplifiedMapping: {
        compact: 'navigation-bar',
        medium: 'navigation-rail',
        expandedAndAbove: 'navigation-drawer-or-rail',
        classification: 'provisional',
      },
    });
  });

  it('records framework-neutral web query and unit policies', () => {
    expect(MATERIAL_LAYOUT_WEB_TRANSLATION_POLICY).toEqual({
      sourceUnit: 'dp',
      cssUnit: 'px',
      numericMapping: 'same-number',
      physicalEquivalenceClaimed: false,
      devicePixelRatioUsed: false,
      classification: 'translated',
    });
    expect(MATERIAL_LAYOUT_QUERY_POLICY).toMatchObject({
      primitiveComponentsAreViewportIndependent: true,
      cssPreferredOverRuntimeMeasurement: true,
      classification: 'web-decision',
    });
    expect(MATERIAL_ADAPTIVE_LAYOUT_WEB_POLICY).toMatchObject({
      browserZoomPreserved: true,
      runtimeResizeHooksRequired: false,
      serverWidthBranchingRecommended: false,
    });
  });

  it('pins sources and records the Material/Android model relationship', () => {
    expect(MATERIAL_ADAPTIVE_LAYOUT_SOURCE).toMatchObject({
      androidXSourceRevision: 'c39790fae05be897dc522b3710db07d44d54f4d0',
      androidWindowSizeGuidanceUpdated: '2026-08-04',
      materialWindowClassRelationship:
        'three-material-classes-plus-two-android-large-width-extensions',
      materialWindowClassLinkedPageStatus:
        'unavailable-during-2026-09-02-audit',
      classifications: {
        thresholdsDp: 'canonical',
        cssPxMapping: 'translated',
        querySerialization: 'translated',
      },
    });
  });

  it('deep-freezes public policy and token data', () => {
    expect(Object.isFrozen(materialWindowSizeClasses)).toBe(true);
    expect(Object.isFrozen(materialWindowSizeClasses.width)).toBe(true);
    expect(Object.isFrozen(materialWindowSizeClasses.width.medium)).toBe(true);
    expect(Object.isFrozen(MATERIAL_WINDOW_SIZE_CLASS_MODELS.current.widthClasses)).toBe(true);
    expect(Object.isFrozen(materialCanonicalLayouts.listDetail)).toBe(true);
    expect(Object.isFrozen(MATERIAL_ADAPTIVE_NAVIGATION_POLICY.drawer.decisionFactors)).toBe(true);
    expect(Object.isFrozen(MATERIAL_LAYOUT_QUERY_POLICY.container.useFor)).toBe(true);
    expect(Object.isFrozen(MATERIAL_ADAPTIVE_LAYOUT_WEB_POLICY.requirements)).toBe(true);
    expect(Object.isFrozen(MATERIAL_ADAPTIVE_LAYOUT_SOURCE.classifications)).toBe(true);
  });
});
