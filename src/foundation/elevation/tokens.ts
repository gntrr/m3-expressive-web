import {
  type MaterialElevationLevel,
  type MaterialElevationLevelName,
  type MaterialElevationLevels,
  type MaterialElevationReferenceDp,
  type MaterialElevationShadow,
  type MaterialElevationShadowLayer,
  type MaterialElevationShadows,
  type MaterialElevationWebLevel,
} from './types.js';

function elevationLevel(
  name: MaterialElevationLevelName,
  webLevel: MaterialElevationWebLevel,
  referenceDp: MaterialElevationReferenceDp,
): MaterialElevationLevel {
  return Object.freeze({
    name,
    webLevel,
    referenceDp,
    classification: 'canonical',
  });
}

export const materialElevation = Object.freeze({
  level0: elevationLevel('level0', 0, 0),
  level1: elevationLevel('level1', 1, 1),
  level2: elevationLevel('level2', 2, 3),
  level3: elevationLevel('level3', 3, 6),
  level4: elevationLevel('level4', 4, 8),
  level5: elevationLevel('level5', 5, 12),
} satisfies MaterialElevationLevels);

function shadowLayer(
  y: number,
  blur: number,
  spread: number,
  opacity: 0.3 | 0.15,
): MaterialElevationShadowLayer {
  return Object.freeze({
    x: '0px',
    y: `${y}px`,
    blur: `${blur}px`,
    spread: `${spread}px`,
    opacity,
    classification: 'canonical',
  });
}

function elevationShadow(
  level: MaterialElevationLevelName,
  key: readonly [y: number, blur: number, spread: number],
  ambient: readonly [y: number, blur: number, spread: number],
): MaterialElevationShadow {
  return Object.freeze({
    level,
    key: shadowLayer(key[0], key[1], key[2], 0.3),
    ambient: shadowLayer(ambient[0], ambient[1], ambient[2], 0.15),
    classification: Object.freeze({
      layers: 'canonical',
      boxShadowSerialization: 'translated',
    }),
  });
}

/** Exact key and ambient layer geometry from the pinned Material Web renderer. */
export const materialElevationShadows = Object.freeze({
  level0: elevationShadow('level0', [0, 0, 0], [0, 0, 0]),
  level1: elevationShadow('level1', [1, 2, 0], [1, 3, 1]),
  level2: elevationShadow('level2', [1, 2, 0], [2, 6, 2]),
  level3: elevationShadow('level3', [1, 3, 0], [4, 8, 3]),
  level4: elevationShadow('level4', [2, 3, 0], [6, 10, 4]),
  level5: elevationShadow('level5', [4, 4, 0], [8, 12, 6]),
} satisfies MaterialElevationShadows);
