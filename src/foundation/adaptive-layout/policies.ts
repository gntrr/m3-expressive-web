import type {
  MaterialAdaptiveLayoutWebPolicy,
  MaterialAdaptiveNavigationPolicy,
  MaterialCanonicalLayoutPolicies,
  MaterialLayoutQueryPolicy,
  MaterialLayoutWebTranslationPolicy,
} from './types.js';

export const materialCanonicalLayouts = Object.freeze({
  feed: Object.freeze({
    name: 'feed',
    relationship: 'peer-collection',
    compact: 'adaptive grid often resolves to one column',
    medium: 'content-driven adaptive grid',
    expandedAndAbove: 'content-driven adaptive grid with optional emphasis spans',
    classification: 'canonical',
  }),
  listDetail: Object.freeze({
    name: 'listDetail',
    relationship: 'list-to-independent-detail',
    compact: 'one pane at a time',
    medium: 'one pane at a time',
    expandedAndAbove: 'list and detail panes side by side; optional extra pane',
    classification: 'canonical',
  }),
  supportingPane: Object.freeze({
    name: 'supportingPane',
    relationship: 'primary-to-dependent-support',
    compact: 'support below primary or in a sheet',
    medium: 'side by side when content tolerates narrower regions',
    expandedAndAbove: 'primary and supporting regions side by side',
    classification: 'canonical',
  }),
} satisfies MaterialCanonicalLayoutPolicies);

export const MATERIAL_ADAPTIVE_NAVIGATION_POLICY = Object.freeze({
  currentDefault: Object.freeze({
    compactWidth: 'bottom-navigation',
    compactHeightOrTabletop: 'bottom-navigation',
    otherwise: 'side-navigation',
    classification: 'translated',
  }),
  drawer: Object.freeze({
    automaticAtExpandedWidth: false,
    decisionFactors: Object.freeze([
      'destination-count',
      'hierarchy',
      'available-content-width',
    ] as const),
    classification: 'web-decision',
  }),
  legacySimplifiedMapping: Object.freeze({
    compact: 'navigation-bar',
    medium: 'navigation-rail',
    expandedAndAbove: 'navigation-drawer-or-rail',
    classification: 'provisional',
  }),
} satisfies MaterialAdaptiveNavigationPolicy);

export const MATERIAL_LAYOUT_QUERY_POLICY = Object.freeze({
  viewport: Object.freeze({
    useFor: Object.freeze([
      'top-level-application-composition',
      'viewport-bound-navigation',
      'safe-area-coordination',
    ] as const),
    feature: 'width',
  }),
  container: Object.freeze({
    useFor: Object.freeze([
      'embedded-adaptive-composition',
      'pane-or-region',
      'reusable-layout',
    ] as const),
    type: 'inline-size',
    feature: 'inline-size',
  }),
  primitiveComponentsAreViewportIndependent: true,
  cssPreferredOverRuntimeMeasurement: true,
  classification: 'web-decision',
} satisfies MaterialLayoutQueryPolicy);

export const MATERIAL_LAYOUT_WEB_TRANSLATION_POLICY = Object.freeze({
  sourceUnit: 'dp',
  cssUnit: 'px',
  numericMapping: 'same-number',
  physicalEquivalenceClaimed: false,
  devicePixelRatioUsed: false,
  classification: 'translated',
} satisfies MaterialLayoutWebTranslationPolicy);

export const MATERIAL_ADAPTIVE_LAYOUT_WEB_POLICY = Object.freeze({
  browserZoomPreserved: true,
  devicePixelRatioBreakpointLogic: false,
  logicalPropertiesPreferred: true,
  runtimeResizeHooksRequired: false,
  serverWidthBranchingRecommended: false,
  requirements: Object.freeze([
    'Respond to resizable windows and split-screen without device labels.',
    'Use container queries for embedded regions and iframe-contained compositions.',
    'Allow for scrollbar and available-content-width differences near boundaries.',
    'Use logical inline/block properties so layout and safe areas work in RTL.',
    'Apply env(safe-area-inset-*) only at viewport-bound edges that need it.',
    'Prefer svh or dvh over a fixed 100vh assumption on mobile browsers.',
    'Keep SSR markup stable and let CSS select the initial layout.',
    'Define print layout independently from screen navigation and breakpoints.',
  ]),
  classification: 'web-decision',
} satisfies MaterialAdaptiveLayoutWebPolicy);
