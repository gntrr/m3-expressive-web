import type { MaterialAdaptiveLayoutSource } from './types.js';

const ANDROIDX_REVISION = 'c39790fae05be897dc522b3710db07d44d54f4d0';
const ANDROIDX_ROOT =
  `https://android.googlesource.com/platform/frameworks/support/+/${ANDROIDX_REVISION}`;

export const MATERIAL_ADAPTIVE_LAYOUT_SOURCE = Object.freeze({
  designSystem: 'Google Material 3',
  androidXSourceRevision: ANDROIDX_REVISION,
  androidXWindowSizeClassSource:
    `${ANDROIDX_ROOT}/window/window-core/src/commonMain/kotlin/androidx/window/core/layout/WindowSizeClass.kt`,
  androidWindowSizeGuidanceSource:
    'https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes',
  androidWindowSizeGuidanceUpdated: '2026-08-04',
  materialWindowClassRelationship:
    'three-material-classes-plus-two-android-large-width-extensions',
  materialWindowClassLinkedPageStatus:
    'unavailable-during-2026-09-02-audit',
  materialCanonicalLayoutSource:
    'https://m3.material.io/foundations/layout/canonical-examples/overview',
  androidCanonicalLayoutSource:
    'https://developer.android.com/develop/adaptive-apps/guides/canonical-layouts',
  androidAdaptiveNavigationSource:
    'https://developer.android.com/develop/adaptive-apps/guides/build-adaptive-navigation',
  androidXAdaptiveNavigationSource:
    `${ANDROIDX_ROOT}/compose/material3/material3-adaptive-navigation-suite/src/commonMain/kotlin/androidx/compose/material3/adaptive/navigationsuite/NavigationSuiteScaffold.kt`,
  cssContainerQuerySource: 'https://www.w3.org/TR/css-contain-3/#container-queries',
  classifications: Object.freeze({
    thresholdsDp: 'canonical',
    cssPxMapping: 'translated',
    querySerialization: 'translated',
    canonicalLayoutRelationships: 'canonical',
    navigationWebPolicy: 'web-decision',
  }),
} satisfies MaterialAdaptiveLayoutSource);
