import type { MaterialTypographySource } from './types.js';

const MATERIAL_WEB_REVISION = 'c05b4b23485c803f68ff31cde52506cea5cc555a';
const MATERIAL_WEB_ROOT =
  `https://github.com/material-components/material-web/blob/${MATERIAL_WEB_REVISION}`;

export const MATERIAL_TYPOGRAPHY_SOURCE = Object.freeze({
  designSystem: 'Google Material 3',
  tokenVersion: '34.0.21',
  sourceRepository: 'https://github.com/material-components/material-web',
  sourceRevision: MATERIAL_WEB_REVISION,
  standardSource:
    `${MATERIAL_WEB_ROOT}/tokens/versions/latest/sass/_md-sys-typescale.scss`,
  emphasizedSource:
    `${MATERIAL_WEB_ROOT}/tokens/versions/latest/sass/_md-sys-typescale-emphasized.scss`,
  typefaceSource:
    `${MATERIAL_WEB_ROOT}/tokens/versions/latest/sass/_md-ref-typeface.scss`,
  androidXCrossCheckRevision: '9df4d001962d58aabca222967b8ceb1789acb960',
  androidXTokenVersion: 'v0_103',
  unitPolicy:
    'Use the official platform-web rem values. Their nominal mapping is Android sp divided by 16, without changing the browser root font size.',
  classifications: Object.freeze({
    standardMetrics: 'canonical',
    emphasizedMetrics: 'canonical',
    cssSerialization: 'translated',
    fontFamilies: 'web-decision',
    excludedAndroidEmphasizedMetrics: 'provisional',
  }),
} satisfies MaterialTypographySource);
