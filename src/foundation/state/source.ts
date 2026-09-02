import type { MaterialStateSource } from './types.js';

const ANDROIDX_REVISION = '2d82078ac06ce59eac8b21a877283b046bf66e3e';
const MATERIAL_WEB_REVISION = 'c05b4b23485c803f68ff31cde52506cea5cc555a';
const ANDROIDX_ROOT =
  `https://android.googlesource.com/platform/frameworks/support/+/${ANDROIDX_REVISION}`;
const MATERIAL_WEB_ROOT =
  `https://github.com/material-components/material-web/blob/${MATERIAL_WEB_REVISION}`;

export const MATERIAL_STATE_SOURCE = Object.freeze({
  designSystem: 'Google Material 3',
  expressiveStateScale: 'none-documented',
  materialGuidanceSource:
    'https://m3.material.io/foundations/interaction/states/overview',
  androidXSourceRevision: ANDROIDX_REVISION,
  androidXTokenVersion: 'v0_210',
  androidXTokenSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StateTokens.kt`,
  materialWebSourceRevision: MATERIAL_WEB_REVISION,
  materialWebTokenVersion: 'v0.192',
  materialWebTokenSource:
    `${MATERIAL_WEB_ROOT}/tokens/versions/v0_192/_md-sys-state.scss`,
  materialWebRippleSource:
    `${MATERIAL_WEB_ROOT}/ripple/internal/_ripple.scss`,
  materialWebDisabledTokenSource:
    `${MATERIAL_WEB_ROOT}/tokens/versions/v0_192/_md-comp-filled-button.scss`,
  legacyWebOpacityDifference: Object.freeze({
    focus: 0.12,
    pressed: 0.12,
    resolution: 'current-androidx-system-tokens-take-precedence',
  }),
  webStandards: Object.freeze({
    focusVisible: 'https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo',
    pointerCapabilities: 'https://www.w3.org/TR/mediaqueries-4/#mf-interaction',
    forcedColors: 'https://www.w3.org/TR/css-color-adjust-1/#forced-colors',
    wcag22: 'https://www.w3.org/TR/WCAG22/',
    ariaDisabled: 'https://www.w3.org/TR/wai-aria-1.2/#aria-disabled',
  }),
  classifications: Object.freeze({
    stateSemantics: 'canonical',
    stateLayerOpacities: 'canonical',
    componentSemanticAxes: 'canonical',
    precedence: 'web-decision',
    cssSerialization: 'translated',
    accessibilityPolicies: 'web-decision',
  }),
} satisfies MaterialStateSource);
