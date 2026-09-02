import { MATERIAL_STATE_SOURCE } from './source.js';
import { materialStates } from './tokens.js';
import {
  MATERIAL_STATE_LAYER_NAMES,
  type MaterialStateCssOptions,
  type MaterialStateCssVariable,
  type MaterialStateCssVariables,
  type MaterialStateLayerName,
} from './types.js';

export function materialStateToCssVariable(
  state: MaterialStateLayerName,
): MaterialStateCssVariable {
  return `--md-sys-state-${state}-state-layer-opacity`;
}

export function toMaterialStateCssVariables(): MaterialStateCssVariables {
  return Object.freeze(
    Object.fromEntries(
      MATERIAL_STATE_LAYER_NAMES.map((state) => [
        materialStateToCssVariable(state),
        materialStates[state].stateLayerOpacity,
      ]),
    ) as Record<MaterialStateCssVariable, 0.08 | 0.1 | 0.16>,
  );
}

function assertSelector(selector: string): string {
  const trimmed = selector.trim();
  if (trimmed.length === 0 || trimmed.includes('{') || trimmed.includes('}')) {
    throw new TypeError('selector must be a non-empty CSS selector without braces.');
  }
  return trimmed;
}

export function toMaterialStateCss(options: MaterialStateCssOptions = {}): string {
  const selector = assertSelector(options.selector ?? ':root');
  const declarations = Object.entries(toMaterialStateCssVariables())
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return [
    `/* Material 3 state ${MATERIAL_STATE_SOURCE.androidXTokenVersion}; source ${MATERIAL_STATE_SOURCE.androidXSourceRevision}. */`,
    `${selector} {`,
    declarations,
    '}',
  ].join('\n');
}
