import type { MaterialElevationSource } from './types.js';

const MATERIAL_WEB_REVISION = 'c05b4b23485c803f68ff31cde52506cea5cc555a';
const ANDROIDX_REVISION = '9df4d001962d58aabca222967b8ceb1789acb960';
const MATERIAL_WEB_ROOT =
  `https://github.com/material-components/material-web/blob/${MATERIAL_WEB_REVISION}`;
const ANDROIDX_ROOT =
  `https://android.googlesource.com/platform/frameworks/support/+/${ANDROIDX_REVISION}`;

export const MATERIAL_ELEVATION_SOURCE = Object.freeze({
  designSystem: 'Google Material 3',
  expressiveScale: 'none-documented',
  materialWebSourceRevision: MATERIAL_WEB_REVISION,
  materialWebTokenVersion: 'v0.192',
  materialWebSystemTokenSource: `${MATERIAL_WEB_ROOT}/tokens/_md-sys-elevation.scss`,
  materialWebShadowSource: `${MATERIAL_WEB_ROOT}/elevation/internal/_elevation.scss`,
  materialWebDocumentationSource: `${MATERIAL_WEB_ROOT}/docs/components/elevation.md`,
  androidXSourceRevision: ANDROIDX_REVISION,
  androidXTokenVersion: 'v0_103',
  androidXTokenSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevationTokens.kt`,
  androidXTonalElevationSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt`,
  tonalElevationPolicy: Object.freeze({
    implemented: false,
    classification: 'web-decision',
    treatment: 'separate-color-treatment',
    rationale:
      'Tonal elevation changes a semantic surface color; it is not a shadow, stacking order, or mapping from web level to z-index.',
  }),
  classifications: Object.freeze({
    levelNames: 'canonical',
    webLevels: 'canonical',
    referenceDp: 'canonical',
    shadowLayers: 'canonical',
    cssLevelSerialization: 'translated',
    cssShadowSerialization: 'translated',
  }),
} satisfies MaterialElevationSource);
