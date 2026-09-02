import { describe, expect, it } from 'vitest';

import {
  MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES,
  MATERIAL_DISABLED_STATE_POLICY,
  MATERIAL_FOCUS_POLICY,
  MATERIAL_FORCED_COLORS_POLICY,
  MATERIAL_INTERACTION_STATE_NAMES,
  MATERIAL_POINTER_POLICY,
  MATERIAL_STATE_PRECEDENCE,
  MATERIAL_STATE_SOURCE,
  materialComponentSemanticStates,
  materialStates,
  materialStateToCssVariable,
  resolveMaterialStateComposition,
  toMaterialStateCss,
  toMaterialStateCssVariables,
  type MaterialInteractionStateName,
} from './index.js';

describe('Material interaction states', () => {
  it('preserves the canonical state classifications and current opacities', () => {
    expect(MATERIAL_INTERACTION_STATE_NAMES).toEqual([
      'enabled',
      'hover',
      'focus',
      'pressed',
      'dragged',
      'disabled',
    ]);
    expect(materialStates.enabled).toMatchObject({
      category: 'baseline',
      visualState: 'default',
      stateLayerOpacity: null,
    });
    expect(materialStates.hover.stateLayerOpacity).toBe(0.08);
    expect(materialStates.focus.stateLayerOpacity).toBe(0.1);
    expect(materialStates.pressed.stateLayerOpacity).toBe(0.1);
    expect(materialStates.dragged.stateLayerOpacity).toBe(0.16);
    expect(materialStates.disabled).toMatchObject({
      category: 'availability',
      interactive: false,
      stateLayerOpacity: null,
    });
    expect(Object.values(materialStates).every(
      ({ classification }) => classification === 'canonical',
    )).toBe(true);
  });

  it('keeps component semantics independent from state layers', () => {
    expect(MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES).toEqual([
      'selected',
      'checked',
      'activated',
      'expanded',
      'error',
    ]);
    expect(materialComponentSemanticStates.checked).toEqual({
      name: 'checked',
      axis: 'value',
      composesWithInteraction: true,
      suppliesStateLayerOpacity: false,
      classification: 'canonical',
    });
  });
});

describe('Material state composition', () => {
  it('defaults to enabled and resolves explicit precedence without stacking', () => {
    expect(resolveMaterialStateComposition()).toMatchObject({
      interactionState: 'enabled',
      stateLayerOpacity: null,
      stateLayerColor: null,
      interactive: true,
    });
    expect(MATERIAL_STATE_PRECEDENCE).toEqual([
      'disabled',
      'dragged',
      'pressed',
      'focus',
      'hover',
      'enabled',
    ]);

    const hoverAndFocus = resolveMaterialStateComposition({
      interactionStates: ['hover'],
      domFocused: true,
      focusVisible: true,
    });
    expect(hoverAndFocus).toMatchObject({
      interactionState: 'focus',
      stateLayerOpacity: 0.1,
      domFocused: true,
      showFocusIndicator: true,
    });

    const pressedAndFocus = resolveMaterialStateComposition({
      interactionStates: ['pressed'],
      focusVisible: true,
    });
    expect(pressedAndFocus).toMatchObject({
      interactionState: 'pressed',
      stateLayerOpacity: 0.1,
      showFocusIndicator: true,
    });
  });

  it('retains semantic state through hover, press, error, and disablement', () => {
    expect(resolveMaterialStateComposition({
      interactionStates: ['hover'],
      semanticStates: ['selected'],
    })).toMatchObject({
      interactionState: 'hover',
      semanticStates: ['selected'],
      stateLayerOpacity: 0.08,
    });

    expect(resolveMaterialStateComposition({
      interactionStates: ['pressed'],
      semanticStates: ['checked'],
    })).toMatchObject({
      interactionState: 'pressed',
      semanticStates: ['checked'],
      stateLayerOpacity: 0.1,
    });

    expect(resolveMaterialStateComposition({
      semanticStates: ['error'],
      focusVisible: true,
    })).toMatchObject({
      interactionState: 'focus',
      semanticStates: ['error'],
      showFocusIndicator: true,
    });

    expect(resolveMaterialStateComposition({
      interactionStates: ['hover', 'disabled'],
      semanticStates: ['checked'],
      domFocused: true,
      focusVisible: true,
    })).toMatchObject({
      interactionState: 'disabled',
      semanticStates: ['checked'],
      stateLayerOpacity: null,
      interactive: false,
      showFocusIndicator: true,
    });
  });

  it('normalizes duplicates, freezes output, and rejects unknown states', () => {
    const result = resolveMaterialStateComposition({
      interactionStates: ['hover', 'hover'],
      semanticStates: ['selected', 'selected'],
    });
    expect(result.activeInteractionStates).toEqual(['hover']);
    expect(result.semanticStates).toEqual(['selected']);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.activeInteractionStates)).toBe(true);
    expect(Object.isFrozen(result.semanticStates)).toBe(true);
    expect(() => resolveMaterialStateComposition({
      interactionStates: ['unknown' as MaterialInteractionStateName],
    })).toThrow('Unknown interaction state: unknown');
  });
});

describe('Material state CSS', () => {
  it('serializes only the four stable system opacity tokens', () => {
    const variables = toMaterialStateCssVariables();
    expect(variables).toEqual({
      '--md-sys-state-hover-state-layer-opacity': 0.08,
      '--md-sys-state-focus-state-layer-opacity': 0.1,
      '--md-sys-state-pressed-state-layer-opacity': 0.1,
      '--md-sys-state-dragged-state-layer-opacity': 0.16,
    });
    expect(materialStateToCssVariable('pressed')).toBe(
      '--md-sys-state-pressed-state-layer-opacity',
    );
    expect(Object.isFrozen(variables)).toBe(true);
  });

  it('emits traceable deterministic CSS and validates selectors', () => {
    const css = toMaterialStateCss({ selector: '[data-material-theme]' });
    expect(css).toContain(
      'Material 3 state v0_210; source 2d82078ac06ce59eac8b21a877283b046bf66e3e.',
    );
    expect(css).toContain('[data-material-theme] {');
    expect(css).toContain(
      '--md-sys-state-dragged-state-layer-opacity: 0.16;',
    );
    expect(css).not.toContain('disabled-state-layer-opacity');
    expect(() => toMaterialStateCss({ selector: ' ' })).toThrow(TypeError);
  });
});

describe('Material state policies and provenance', () => {
  it('does not promote component disabled opacities to system tokens', () => {
    expect(MATERIAL_DISABLED_STATE_POLICY).toMatchObject({
      stateLayerOpacity: null,
      suppressesInteractionStateLayers: true,
      containerOpacity: 'component-specific',
      contentOpacityReference: {
        value: 0.38,
        scope: 'common-component-token-reference',
        universalSystemToken: false,
        classification: 'canonical',
      },
      nativeDisabledPreferredWhenAvailable: true,
      ariaDisabledRequiresManualSuppression: true,
    });
  });

  it('records web focus, pointer, and forced-color decisions', () => {
    expect(MATERIAL_FOCUS_POLICY.visibleFocusSelector).toBe(':focus-visible');
    expect(MATERIAL_POINTER_POLICY.hoverCapabilityQuery).toBe('(hover: hover)');
    expect(MATERIAL_FORCED_COLORS_POLICY).toMatchObject({
      mediaQuery: '(forced-colors: active)',
      suppressTranslucentStateLayers: true,
      preserveUserAgentAdjustment: true,
    });
  });

  it('pins current and legacy sources without hiding the opacity conflict', () => {
    expect(MATERIAL_STATE_SOURCE).toMatchObject({
      expressiveStateScale: 'none-documented',
      androidXSourceRevision: '2d82078ac06ce59eac8b21a877283b046bf66e3e',
      androidXTokenVersion: 'v0_210',
      materialWebSourceRevision: 'c05b4b23485c803f68ff31cde52506cea5cc555a',
      materialWebTokenVersion: 'v0.192',
      legacyWebOpacityDifference: {
        focus: 0.12,
        pressed: 0.12,
        resolution: 'current-androidx-system-tokens-take-precedence',
      },
      classifications: {
        stateLayerOpacities: 'canonical',
        precedence: 'web-decision',
        cssSerialization: 'translated',
      },
    });
  });

  it('deep-freezes public data', () => {
    expect(Object.isFrozen(materialStates)).toBe(true);
    expect(Object.isFrozen(materialStates.hover)).toBe(true);
    expect(Object.isFrozen(materialComponentSemanticStates)).toBe(true);
    expect(Object.isFrozen(MATERIAL_DISABLED_STATE_POLICY)).toBe(true);
    expect(Object.isFrozen(MATERIAL_DISABLED_STATE_POLICY.contentOpacityReference)).toBe(true);
    expect(Object.isFrozen(MATERIAL_FORCED_COLORS_POLICY.fallbackChannels)).toBe(true);
    expect(Object.isFrozen(MATERIAL_STATE_SOURCE)).toBe(true);
    expect(Object.isFrozen(MATERIAL_STATE_SOURCE.legacyWebOpacityDifference)).toBe(true);
    expect(Object.isFrozen(MATERIAL_STATE_SOURCE.webStandards)).toBe(true);
    expect(Object.isFrozen(MATERIAL_STATE_SOURCE.classifications)).toBe(true);
  });
});
