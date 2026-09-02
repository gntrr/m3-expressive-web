import type {
  MaterialExpressiveShape,
  MaterialNormalizedShapeGeometry,
  MaterialShapeSvgOptions,
} from './types.js';

function resolveGeometry(
  shape: MaterialExpressiveShape | MaterialNormalizedShapeGeometry,
): MaterialNormalizedShapeGeometry {
  return 'geometry' in shape ? shape.geometry : shape;
}

function formatter(precision: number): (value: number) => string {
  if (!Number.isInteger(precision) || precision < 0 || precision > 9) {
    throw new RangeError('precision must be an integer from 0 through 9.');
  }
  return (value) => {
    const result = value.toFixed(precision).replace(/\.?0+$/, '');
    return result === '-0' || result === '' ? '0' : result;
  };
}

/** Serializes normalized geometry as an SVG path in a `0 0 1 1` viewBox. */
export function toMaterialShapeSvgPath(
  shape: MaterialExpressiveShape | MaterialNormalizedShapeGeometry,
  options: MaterialShapeSvgOptions = {},
): string {
  const geometry = resolveGeometry(shape);
  const format = formatter(options.precision ?? 6);
  const first = geometry.segments[0];
  if (!first) throw new RangeError('shape geometry must contain at least one segment.');

  const commands = [`M ${format(first.start.x)} ${format(first.start.y)}`];
  for (const segment of geometry.segments) {
    commands.push(
      `C ${format(segment.control1.x)} ${format(segment.control1.y)} ` +
        `${format(segment.control2.x)} ${format(segment.control2.y)} ` +
        `${format(segment.end.x)} ${format(segment.end.y)}`,
    );
  }
  commands.push('Z');
  return commands.join(' ');
}
