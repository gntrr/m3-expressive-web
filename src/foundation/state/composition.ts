import {
  MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES,
  MATERIAL_INTERACTION_STATE_NAMES,
  type MaterialInteractionStateName,
  type MaterialResolvedStateComposition,
  type MaterialStateCompositionInput,
} from './types.js';
import { materialStates, MATERIAL_STATE_PRECEDENCE } from './tokens.js';

const interactionNames = new Set<string>(MATERIAL_INTERACTION_STATE_NAMES);
const semanticNames = new Set<string>(MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES);

function uniqueValidated<T extends string>(
  values: readonly T[],
  allowed: ReadonlySet<string>,
  label: string,
): Set<T> {
  const result = new Set<T>();
  for (const value of values) {
    if (!allowed.has(value)) {
      throw new TypeError(`Unknown ${label}: ${value}`);
    }
    result.add(value);
  }
  return result;
}

/**
 * Resolves concurrent states without relying on CSS source order. Semantic
 * state is retained independently, while one dominant interaction layer is
 * selected. Visible focus remains a separate indication channel.
 */
export function resolveMaterialStateComposition(
  input: MaterialStateCompositionInput = {},
): MaterialResolvedStateComposition {
  const interactions = uniqueValidated(
    input.interactionStates ?? [],
    interactionNames,
    'interaction state',
  );

  if (input.focusVisible) interactions.add('focus');
  if (interactions.size === 0) interactions.add('enabled');

  const activeInteractionStates = MATERIAL_INTERACTION_STATE_NAMES.filter((state) =>
    interactions.has(state),
  );
  const interactionState = MATERIAL_STATE_PRECEDENCE.find((state) =>
    interactions.has(state),
  ) as MaterialInteractionStateName;

  const semanticSet = uniqueValidated(
    input.semanticStates ?? [],
    semanticNames,
    'component semantic state',
  );
  const semanticStates = MATERIAL_COMPONENT_SEMANTIC_STATE_NAMES.filter((state) =>
    semanticSet.has(state),
  );
  const state = materialStates[interactionState];

  return Object.freeze({
    interactionState,
    activeInteractionStates: Object.freeze(activeInteractionStates),
    semanticStates: Object.freeze(semanticStates),
    stateLayerOpacity: state.stateLayerOpacity,
    stateLayerColor:
      state.category === 'state-layer' ? 'component-defined' : null,
    interactive: state.interactive,
    domFocused: input.domFocused ?? input.focusVisible ?? false,
    showFocusIndicator: input.focusVisible ?? false,
    classification: 'web-decision',
  });
}
