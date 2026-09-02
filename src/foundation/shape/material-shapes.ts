import { MATERIAL_SHAPE_SOURCE_DEFINITIONS } from './expressive-definitions.js';
import { createNormalizedGeometry } from './geometry.js';
import {
  MATERIAL_EXPRESSIVE_SHAPE_NAMES,
  type MaterialExpressiveShape,
  type MaterialExpressiveShapeName,
  type MaterialExpressiveShapes,
} from './types.js';

const SHAPE_CLASSIFICATION = Object.freeze({
  definition: 'canonical',
  geometry: 'translated',
} as const);

const shapeCache = new Map<MaterialExpressiveShapeName, MaterialExpressiveShape>();

/** Returns one lazily generated, immutable Material Expressive named shape. */
export function getMaterialShape(
  name: MaterialExpressiveShapeName,
): MaterialExpressiveShape {
  const cached = shapeCache.get(name);
  if (cached) return cached;

  const definition = MATERIAL_SHAPE_SOURCE_DEFINITIONS[name];
  if (!definition) {
    throw new RangeError(`Unsupported Material shape: ${String(name)}.`);
  }
  const source = definition.create();
  const shape = Object.freeze({
    name,
    androidName: definition.androidName,
    geometry: createNormalizedGeometry(source.vertices, source.center),
    stability: 'experimental',
    classification: SHAPE_CLASSIFICATION,
  } satisfies MaterialExpressiveShape);
  shapeCache.set(name, shape);
  return shape;
}

const shapeProperties = Object.fromEntries(
  MATERIAL_EXPRESSIVE_SHAPE_NAMES.map((name) => [
    name,
    {
      enumerable: true,
      configurable: false,
      get: () => getMaterialShape(name),
    },
  ]),
) as PropertyDescriptorMap;

/** Lazily evaluated official Material Expressive shape vocabulary. */
export const materialShapes = Object.freeze(
  Object.defineProperties({}, shapeProperties),
) as MaterialExpressiveShapes;
