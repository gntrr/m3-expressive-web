import type { MaterialMotionSource } from './types.js';

const ANDROIDX_REVISION = '9df4d001962d58aabca222967b8ceb1789acb960';
const MATERIAL_WEB_REVISION = 'c05b4b23485c803f68ff31cde52506cea5cc555a';
const MATERIAL_COMPONENTS_ANDROID_REVISION =
  'ac7e18efeefb331850c561faf9ab8bf81d27ba68';
const ANDROIDX_ROOT =
  `https://android.googlesource.com/platform/frameworks/support/+/${ANDROIDX_REVISION}`;
const MATERIAL_WEB_ROOT =
  `https://github.com/material-components/material-web/blob/${MATERIAL_WEB_REVISION}`;
const MATERIAL_COMPONENTS_ANDROID_ROOT =
  `https://github.com/material-components/material-components-android/blob/${MATERIAL_COMPONENTS_ANDROID_REVISION}`;

export const MATERIAL_MOTION_SOURCE = Object.freeze({
  designSystem: 'Google Material 3',
  androidXSourceRevision: ANDROIDX_REVISION,
  androidXTokenVersion: 'v0_14_0',
  androidXMotionSchemeSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MotionScheme.kt`,
  androidXStandardTokenSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt`,
  androidXExpressiveTokenSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt`,
  materialWebSourceRevision: MATERIAL_WEB_REVISION,
  materialWebTokenVersion: 'v0.192',
  materialWebTokenSource:
    `${MATERIAL_WEB_ROOT}/tokens/versions/v0_192/_md-sys-motion.scss`,
  materialWebSupportStatus: 'tokens-generated-components-unsupported',
  materialComponentsAndroidRevision: MATERIAL_COMPONENTS_ANDROID_REVISION,
  materialComponentsAndroidMotionSource:
    `${MATERIAL_COMPONENTS_ANDROID_ROOT}/docs/theming/Motion.md`,
  webTranslationPolicy:
    'Serialize canonical duration and directly representable easing tokens. Preserve springs as physics data until a solver defines mass, initial velocity, settling thresholds, interruption, and sampling.',
  classifications: Object.freeze({
    semanticCategories: 'canonical',
    springParameters: 'canonical',
    durationTokens: 'canonical',
    easingSources: 'canonical',
    emphasizedCssEasing: 'translated',
    cssSerialization: 'translated',
    reducedMotionPolicy: 'web-decision',
  }),
} satisfies MaterialMotionSource);
