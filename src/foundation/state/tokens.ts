import {
  type MaterialComponentSemanticState,
  type MaterialComponentSemanticStateName,
  type MaterialComponentSemanticStates,
  type MaterialDisabledStatePolicy,
  type MaterialFocusPolicy,
  type MaterialForcedColorsPolicy,
  type MaterialInteractionState,
  type MaterialInteractionStateName,
  type MaterialInteractionStates,
  type MaterialPointerPolicy,
  type MaterialStateLayerOpacity,
} from './types.js';

function interactionState(
  name: MaterialInteractionStateName,
  category: MaterialInteractionState['category'],
  opacity: MaterialStateLayerOpacity | null,
): MaterialInteractionState {
  return Object.freeze({
    name,
    category,
    visualState: name === 'enabled' ? 'default' : name,
    interactive: name !== 'disabled',
    stateLayerOpacity: opacity,
    classification: 'canonical',
  });
}

export const materialStates = Object.freeze({
  enabled: interactionState('enabled', 'baseline', null),
  hover: interactionState('hover', 'state-layer', 0.08),
  focus: interactionState('focus', 'state-layer', 0.1),
  pressed: interactionState('pressed', 'state-layer', 0.1),
  dragged: interactionState('dragged', 'state-layer', 0.16),
  disabled: interactionState('disabled', 'availability', null),
} satisfies MaterialInteractionStates);

function semanticState(
  name: MaterialComponentSemanticStateName,
  axis: MaterialComponentSemanticState['axis'],
): MaterialComponentSemanticState {
  return Object.freeze({
    name,
    axis,
    composesWithInteraction: true,
    suppliesStateLayerOpacity: false,
    classification: 'canonical',
  });
}

export const materialComponentSemanticStates = Object.freeze({
  selected: semanticState('selected', 'selection'),
  checked: semanticState('checked', 'value'),
  activated: semanticState('activated', 'activation'),
  expanded: semanticState('expanded', 'disclosure'),
  error: semanticState('error', 'validity'),
} satisfies MaterialComponentSemanticStates);

export const MATERIAL_STATE_PRECEDENCE = Object.freeze([
  'disabled',
  'dragged',
  'pressed',
  'focus',
  'hover',
  'enabled',
] as const);

export const MATERIAL_DISABLED_STATE_POLICY = Object.freeze({
  stateLayerOpacity: null,
  suppressesInteractionStateLayers: true,
  containerOpacity: 'component-specific',
  contentOpacityReference: Object.freeze({
    value: 0.38,
    scope: 'common-component-token-reference',
    universalSystemToken: false,
    classification: 'canonical',
  }),
  nativeDisabledPreferredWhenAvailable: true,
  ariaDisabledRequiresManualSuppression: true,
  classification: 'translated',
} satisfies MaterialDisabledStatePolicy);

export const MATERIAL_FOCUS_POLICY = Object.freeze({
  domFocusSelector: ':focus',
  visibleFocusSelector: ':focus-visible',
  visibleIndicatorIsSeparateFromStateLayer: true,
  removeUserAgentOutlineWithoutReplacement: false,
  classification: 'web-decision',
} satisfies MaterialFocusPolicy);

export const MATERIAL_POINTER_POLICY = Object.freeze({
  hoverCapabilityQuery: '(hover: hover)',
  coarsePointerQuery: '(pointer: coarse)',
  anyCoarsePointerQuery: '(any-pointer: coarse)',
  hoverIsSupplemental: true,
  classification: 'web-decision',
} satisfies MaterialPointerPolicy);

export const MATERIAL_FORCED_COLORS_POLICY = Object.freeze({
  mediaQuery: '(forced-colors: active)',
  suppressTranslucentStateLayers: true,
  preserveUserAgentAdjustment: true,
  fallbackChannels: Object.freeze([
    'native-boundary',
    'system-color-outline',
    'text-or-symbol',
  ]),
  classification: 'web-decision',
} satisfies MaterialForcedColorsPolicy);
