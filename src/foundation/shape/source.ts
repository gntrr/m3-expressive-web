import type { MaterialShapeSource } from './types.js';

const MATERIAL_WEB_REVISION = 'c05b4b23485c803f68ff31cde52506cea5cc555a';
const ANDROIDX_REVISION = '9df4d001962d58aabca222967b8ceb1789acb960';
const ANDROIDX_ROOT =
  `https://android.googlesource.com/platform/frameworks/support/+/${ANDROIDX_REVISION}`;

export const MATERIAL_SHAPE_SOURCE = Object.freeze({
  designSystem: 'Google Material 3',
  webTokenVersion: '34.0.21',
  webSourceRevision: MATERIAL_WEB_REVISION,
  webShapeTokenSource:
    `https://github.com/material-components/material-web/blob/${MATERIAL_WEB_REVISION}/tokens/versions/latest/sass/_md-sys-shape.scss`,
  androidXSourceRevision: ANDROIDX_REVISION,
  androidXShapeTokenVersion: '14_1_0',
  androidXShapeTokenSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt`,
  androidXMaterialShapesSource:
    `${ANDROIDX_ROOT}/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt`,
  androidXGeometrySource:
    `${ANDROIDX_ROOT}/graphics/graphics-shapes/src/commonMain/kotlin/androidx/graphics/shapes/RoundedPolygon.kt`,
  expressiveApiStability: 'experimental',
  normalizationPolicy:
    'Translate source vertices and rounding into cubic Beziers, then fit the approximate control-point bounds inside a centered unit square, matching AndroidX RoundedPolygon.normalized().',
  classifications: Object.freeze({
    cornerRoles: 'canonical',
    expressiveDefinitions: 'canonical',
    normalizedGeometry: 'translated',
    cssSerialization: 'translated',
    svgSerialization: 'translated',
    rtlSerialization: 'web-decision',
  }),
} satisfies MaterialShapeSource);
