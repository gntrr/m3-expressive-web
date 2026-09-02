import { describe, expect, it } from 'vitest';

import {
  createMaterialMotionTiming,
  getMaterialMotionScheme,
  MATERIAL_MOTION_CATEGORIES,
  MATERIAL_MOTION_DURATION_NAMES,
  MATERIAL_MOTION_EASING_NAMES,
  MATERIAL_MOTION_SOURCE,
  MATERIAL_REDUCED_MOTION_POLICY,
  materialMotion,
  materialMotionDurationToCssVariable,
  materialMotionDurations,
  materialMotionEasingToCssVariable,
  materialMotionEasings,
  toMaterialMotionCss,
  toMaterialMotionCssVariables,
  type MaterialMotionSchemeName,
} from './index.js';

describe('Material motion schemes', () => {
  it('defines the six canonical semantic categories', () => {
    expect(MATERIAL_MOTION_CATEGORIES).toEqual([
      'fastSpatial',
      'defaultSpatial',
      'slowSpatial',
      'fastEffects',
      'defaultEffects',
      'slowEffects',
    ]);
    expect(Object.keys(materialMotion.standard.tokens)).toEqual([
      ...MATERIAL_MOTION_CATEGORIES,
    ]);
  });

  it('preserves Standard spring physics independently', () => {
    expect(materialMotion.standard.tokens).toMatchObject({
      fastSpatial: { model: { dampingRatio: 0.9, stiffness: 1400 } },
      defaultSpatial: { model: { dampingRatio: 0.9, stiffness: 700 } },
      slowSpatial: { model: { dampingRatio: 0.9, stiffness: 300 } },
      fastEffects: { model: { dampingRatio: 1, stiffness: 3800 } },
      defaultEffects: { model: { dampingRatio: 1, stiffness: 1600 } },
      slowEffects: { model: { dampingRatio: 1, stiffness: 800 } },
    });
  });

  it('preserves Expressive spring physics independently', () => {
    expect(materialMotion.expressive.tokens).toMatchObject({
      fastSpatial: { model: { dampingRatio: 0.6, stiffness: 800 } },
      defaultSpatial: { model: { dampingRatio: 0.8, stiffness: 380 } },
      slowSpatial: { model: { dampingRatio: 0.8, stiffness: 200 } },
      fastEffects: { model: { dampingRatio: 1, stiffness: 3800 } },
      defaultEffects: { model: { dampingRatio: 1, stiffness: 1600 } },
      slowEffects: { model: { dampingRatio: 1, stiffness: 800 } },
    });
    expect(materialMotion.expressive).not.toBe(materialMotion.standard);
  });

  it('retrieves only known schemes and keeps physics duration-free', () => {
    expect(getMaterialMotionScheme('standard')).toBe(materialMotion.standard);
    expect(getMaterialMotionScheme('expressive')).toBe(materialMotion.expressive);
    expect(materialMotion.expressive.tokens.fastSpatial.model.fixedDuration).toBe(
      false,
    );
    expect(() =>
      getMaterialMotionScheme('playful' as MaterialMotionSchemeName),
    ).toThrow(RangeError);
  });

  it('deep-freezes schemes and tokens', () => {
    expect(Object.isFrozen(materialMotion)).toBe(true);
    expect(Object.isFrozen(materialMotion.standard)).toBe(true);
    expect(Object.isFrozen(materialMotion.standard.tokens)).toBe(true);
    expect(Object.isFrozen(materialMotion.standard.tokens.fastSpatial)).toBe(true);
    expect(Object.isFrozen(materialMotion.standard.tokens.fastSpatial.model)).toBe(
      true,
    );
  });
});

describe('Material curve motion', () => {
  it('defines the canonical duration scale', () => {
    expect(MATERIAL_MOTION_DURATION_NAMES).toHaveLength(16);
    expect(materialMotionDurations.short1).toMatchObject({
      milliseconds: 50,
      cssValue: '50ms',
      classification: 'canonical',
    });
    expect(materialMotionDurations.medium2.cssValue).toBe('300ms');
    expect(materialMotionDurations.extraLong4.cssValue).toBe('1000ms');
  });

  it('preserves canonical easing sources and the emphasized web translation', () => {
    expect(MATERIAL_MOTION_EASING_NAMES).toHaveLength(7);
    expect(materialMotionEasings.standard).toMatchObject({
      source: {
        kind: 'cubic-bezier',
        controlPoints: [0.2, 0, 0, 1],
        classification: 'canonical',
      },
      css: {
        value: 'cubic-bezier(0.2, 0, 0, 1)',
        classification: 'canonical',
      },
    });
    expect(materialMotionEasings.emphasized).toMatchObject({
      source: { kind: 'path', classification: 'canonical' },
      css: {
        value: 'cubic-bezier(0.2, 0, 0, 1)',
        classification: 'translated',
      },
    });
  });

  it('creates deterministic normalized timing records from semantic tokens', () => {
    const first = createMaterialMotionTiming('medium4', 'emphasizedDecelerate');
    const second = createMaterialMotionTiming('medium4', 'emphasizedDecelerate');
    expect(first).toEqual(second);
    expect(first).toMatchObject({
      kind: 'timing',
      duration: { name: 'medium4', milliseconds: 400 },
      easing: { name: 'emphasizedDecelerate' },
      classification: 'canonical',
    });
    expect(createMaterialMotionTiming('long2', 'emphasized').classification).toBe(
      'translated',
    );
    expect(Object.isFrozen(first)).toBe(true);
  });

  it('serializes only static web curve representations', () => {
    expect(materialMotionDurationToCssVariable('extraLong1')).toBe(
      '--md-sys-motion-duration-extra-long1',
    );
    expect(materialMotionEasingToCssVariable('standardAccelerate')).toBe(
      '--md-sys-motion-easing-standard-accelerate',
    );

    const variables = toMaterialMotionCssVariables();
    expect(Object.keys(variables)).toHaveLength(23);
    expect(variables['--md-sys-motion-duration-short4']).toBe('200ms');
    expect(variables['--md-sys-motion-easing-emphasized']).toBe(
      'cubic-bezier(0.2, 0, 0, 1)',
    );
    expect(Object.keys(variables).some((name) => name.includes('spring'))).toBe(false);
    expect(Object.isFrozen(variables)).toBe(true);

    const css = toMaterialMotionCss({ selector: '[data-material-motion]' });
    expect(css).toContain(
      'Material 3 motion v0.192; source c05b4b23485c803f68ff31cde52506cea5cc555a.',
    );
    expect(css).toContain('[data-material-motion] {');
    expect(css).toContain('--md-sys-motion-duration-extra-long4: 1000ms;');
    expect(css).not.toContain('--md-sys-motion-spring-');
    expect(() => toMaterialMotionCss({ selector: ' ' })).toThrow(TypeError);
  });

  it('deep-freezes duration and easing data', () => {
    expect(Object.isFrozen(materialMotionDurations)).toBe(true);
    expect(Object.isFrozen(materialMotionDurations.short1)).toBe(true);
    expect(Object.isFrozen(materialMotionEasings)).toBe(true);
    expect(Object.isFrozen(materialMotionEasings.standard.source)).toBe(true);
    if (materialMotionEasings.standard.source.kind === 'cubic-bezier') {
      expect(
        Object.isFrozen(materialMotionEasings.standard.source.controlPoints),
      ).toBe(true);
    }
    expect(Object.isFrozen(materialMotionEasings.standard.css)).toBe(true);
  });
});

describe('Motion accessibility and provenance', () => {
  it('defines a non-destructive reduced-motion policy', () => {
    expect(MATERIAL_REDUCED_MOTION_POLICY).toMatchObject({
      mediaQuery: '(prefers-reduced-motion: reduce)',
      globalZeroDurationReset: false,
      finalStateMustMatch: true,
      rules: {
        decorative: { action: 'remove' },
        spatial: { action: 'replace-with-effects' },
        stateFeedback: { action: 'preserve-feedback' },
        essential: { action: 'preserve-essential' },
      },
      classification: 'web-decision',
    });
    expect(Object.isFrozen(MATERIAL_REDUCED_MOTION_POLICY)).toBe(true);
    expect(Object.isFrozen(MATERIAL_REDUCED_MOTION_POLICY.rules)).toBe(true);
    expect(Object.isFrozen(MATERIAL_REDUCED_MOTION_POLICY.requirements)).toBe(true);
  });

  it('pins source versions and classifications', () => {
    expect(MATERIAL_MOTION_SOURCE).toMatchObject({
      androidXSourceRevision: '9df4d001962d58aabca222967b8ceb1789acb960',
      androidXTokenVersion: 'v0_14_0',
      materialWebSourceRevision: 'c05b4b23485c803f68ff31cde52506cea5cc555a',
      materialWebTokenVersion: 'v0.192',
      materialWebSupportStatus: 'tokens-generated-components-unsupported',
      materialComponentsAndroidRevision:
        'ac7e18efeefb331850c561faf9ab8bf81d27ba68',
      classifications: {
        semanticCategories: 'canonical',
        springParameters: 'canonical',
        durationTokens: 'canonical',
        easingSources: 'canonical',
        emphasizedCssEasing: 'translated',
        cssSerialization: 'translated',
        reducedMotionPolicy: 'web-decision',
      },
    });
    expect(Object.isFrozen(MATERIAL_MOTION_SOURCE)).toBe(true);
    expect(Object.isFrozen(MATERIAL_MOTION_SOURCE.classifications)).toBe(true);
  });
});
