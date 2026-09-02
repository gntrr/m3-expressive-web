import {
  sourceVertex,
  type SourceVertex,
} from './geometry.js';
import type {
  MaterialExpressiveShapeName,
  MaterialShapePoint,
} from './types.js';

export interface SourcePolygon {
  readonly vertices: readonly SourceVertex[];
  readonly center: MaterialShapePoint;
}

export interface MaterialShapeSourceDefinition {
  readonly androidName: string;
  readonly create: () => SourcePolygon;
}

const ORIGIN = Object.freeze({ x: 0, y: 0 });
const UNIT_CENTER = Object.freeze({ x: 0.5, y: 0.5 });

function regularPolygon(
  count: number,
  radius = 1,
  rounding = 0,
  center: MaterialShapePoint = ORIGIN,
  perVertexRounding?: readonly number[],
): SourcePolygon {
  return {
    center,
    vertices: Array.from({ length: count }, (_, index) => {
      const angle = (Math.PI * 2 * index) / count;
      return sourceVertex(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius,
        perVertexRounding?.[index] ?? rounding,
      );
    }),
  };
}

function rectangle(
  width: number,
  height: number,
  roundings: readonly number[],
  center: MaterialShapePoint = ORIGIN,
): SourcePolygon {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return {
    center,
    vertices: [
      sourceVertex(center.x + halfWidth, center.y + halfHeight, roundings[0]),
      sourceVertex(center.x - halfWidth, center.y + halfHeight, roundings[1]),
      sourceVertex(center.x - halfWidth, center.y - halfHeight, roundings[2]),
      sourceVertex(center.x + halfWidth, center.y - halfHeight, roundings[3]),
    ],
  };
}

function circle(vertexCount: number): SourcePolygon {
  const polygonRadius = 1 / Math.cos(Math.PI / vertexCount);
  return regularPolygon(vertexCount, polygonRadius, 1);
}

function star(
  count: number,
  innerRadius: number,
  rounding: number,
): SourcePolygon {
  const vertices: SourceVertex[] = [];
  for (let index = 0; index < count; index += 1) {
    const outerAngle = (Math.PI * 2 * index) / count;
    const innerAngle = (Math.PI * (2 * index + 1)) / count;
    vertices.push(
      sourceVertex(Math.cos(outerAngle), Math.sin(outerAngle), rounding),
      sourceVertex(
        Math.cos(innerAngle) * innerRadius,
        Math.sin(innerAngle) * innerRadius,
        rounding,
      ),
    );
  }
  return { vertices, center: ORIGIN };
}

function transform(
  polygon: SourcePolygon,
  transformPoint: (point: MaterialShapePoint) => MaterialShapePoint,
): SourcePolygon {
  return {
    center: transformPoint(polygon.center),
    vertices: polygon.vertices.map((vertex) => ({
      point: transformPoint(vertex.point),
      rounding: vertex.rounding,
    })),
  };
}

function rotate(polygon: SourcePolygon, degrees: number): SourcePolygon {
  const angle = (degrees / 180) * Math.PI;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return transform(polygon, (point) => ({
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
  }));
}

function scale(polygon: SourcePolygon, x: number, y: number): SourcePolygon {
  return transform(polygon, (point) => ({ x: point.x * x, y: point.y * y }));
}

function repeatVertices(
  points: readonly SourceVertex[],
  repetitions: number,
  center: MaterialShapePoint,
  mirroring: boolean,
): readonly SourceVertex[] {
  if (!mirroring) {
    return Array.from({ length: points.length * repetitions }, (_, index) => {
      const source = points[index % points.length]!;
      const angle =
        (Math.floor(index / points.length) * Math.PI * 2) / repetitions;
      const offsetX = source.point.x - center.x;
      const offsetY = source.point.y - center.y;
      return {
        point: {
          x: offsetX * Math.cos(angle) - offsetY * Math.sin(angle) + center.x,
          y: offsetX * Math.sin(angle) + offsetY * Math.cos(angle) + center.y,
        },
        rounding: source.rounding,
      };
    });
  }

  const angles = points.map(
    (point) =>
      (Math.atan2(point.point.y - center.y, point.point.x - center.x) * 180) /
      Math.PI,
  );
  const distances = points.map((point) =>
    Math.hypot(point.point.x - center.x, point.point.y - center.y),
  );
  const actualRepetitions = repetitions * 2;
  const sectionAngle = 360 / actualRepetitions;
  const result: SourceVertex[] = [];

  for (let repetition = 0; repetition < actualRepetitions; repetition += 1) {
    for (let index = 0; index < points.length; index += 1) {
      const sourceIndex =
        repetition % 2 === 0 ? index : points.length - 1 - index;
      if (sourceIndex === 0 && repetition % 2 !== 0) continue;
      const localAngle =
        repetition % 2 === 0
          ? angles[sourceIndex]!
          : sectionAngle - angles[sourceIndex]! + 2 * angles[0]!;
      const angle = ((sectionAngle * repetition + localAngle) / 180) * Math.PI;
      result.push({
        point: {
          x: Math.cos(angle) * distances[sourceIndex]! + center.x,
          y: Math.sin(angle) * distances[sourceIndex]! + center.y,
        },
        rounding: points[sourceIndex]!.rounding,
      });
    }
  }

  return result;
}

function custom(
  points: readonly SourceVertex[],
  repetitions: number,
  mirroring = false,
  center: MaterialShapePoint = UNIT_CENTER,
): SourcePolygon {
  return {
    vertices: repeatVertices(points, repetitions, center, mirroring),
    center,
  };
}

const definitions = {
  circle: { androidName: 'Circle', create: () => circle(10) },
  square: {
    androidName: 'Square',
    create: () => rectangle(1, 1, [0.3, 0.3, 0.3, 0.3]),
  },
  slanted: {
    androidName: 'Slanted',
    create: () =>
      custom(
        [
          sourceVertex(0.926, 0.97, 0.189, 0.811),
          sourceVertex(-0.021, 0.967, 0.187, 0.057),
        ],
        2,
      ),
  },
  arch: {
    androidName: 'Arch',
    create: () => rotate(regularPolygon(4, 1, 0, ORIGIN, [1, 1, 0.2, 0.2]), -135),
  },
  fan: {
    androidName: 'Fan',
    create: () =>
      custom([
        sourceVertex(1.004, 1, 0.148, 0.417),
        sourceVertex(0, 1, 0.151),
        sourceVertex(0, -0.003, 0.148),
        sourceVertex(0.978, 0.02, 0.803),
      ], 1),
  },
  arrow: {
    androidName: 'Arrow',
    create: () =>
      custom([
        sourceVertex(0.5, 0.892, 0.313),
        sourceVertex(-0.216, 1.05, 0.207),
        sourceVertex(0.499, -0.16, 0.215, 1),
        sourceVertex(1.225, 1.06, 0.211),
      ], 1),
  },
  semiCircle: {
    androidName: 'SemiCircle',
    create: () => rectangle(1.6, 1, [0.2, 0.2, 1, 1]),
  },
  oval: {
    androidName: 'Oval',
    create: () => rotate(scale(circle(8), 1, 0.64), -45),
  },
  pill: {
    androidName: 'Pill',
    create: () =>
      custom(
        [
          sourceVertex(0.961, 0.039, 0.426),
          sourceVertex(1.001, 0.428),
          sourceVertex(1, 0.609, 1),
        ],
        2,
        true,
      ),
  },
  triangle: {
    androidName: 'Triangle',
    create: () => rotate(regularPolygon(3, 1, 0.2), -90),
  },
  diamond: {
    androidName: 'Diamond',
    create: () =>
      custom([
        sourceVertex(0.5, 1.096, 0.151, 0.524),
        sourceVertex(0.04, 0.5, 0.159),
      ], 2),
  },
  clamShell: {
    androidName: 'ClamShell',
    create: () =>
      custom([
        sourceVertex(0.171, 0.841, 0.159),
        sourceVertex(-0.02, 0.5, 0.14),
        sourceVertex(0.17, 0.159, 0.159),
      ], 2),
  },
  pentagon: {
    androidName: 'Pentagon',
    create: () =>
      custom(
        [
          sourceVertex(0.5, -0.009, 0.172),
          sourceVertex(1.03, 0.365, 0.164),
          sourceVertex(0.828, 0.97, 0.169),
        ],
        1,
        true,
      ),
  },
  gem: {
    androidName: 'Gem',
    create: () =>
      custom(
        [
          sourceVertex(0.499, 1.023, 0.241, 0.778),
          sourceVertex(-0.005, 0.792, 0.208),
          sourceVertex(0.073, 0.258, 0.228),
          sourceVertex(0.433, 0, 0.491),
        ],
        1,
        true,
      ),
  },
  sunny: { androidName: 'Sunny', create: () => star(8, 0.8, 0.15) },
  verySunny: {
    androidName: 'VerySunny',
    create: () =>
      custom([
        sourceVertex(0.5, 1.08, 0.085),
        sourceVertex(0.358, 0.843, 0.085),
      ], 8),
  },
  cookie4Sided: {
    androidName: 'Cookie4Sided',
    create: () =>
      custom([
        sourceVertex(1.237, 1.236, 0.258),
        sourceVertex(0.5, 0.918, 0.233),
      ], 4),
  },
  cookie6Sided: {
    androidName: 'Cookie6Sided',
    create: () =>
      custom([
        sourceVertex(0.723, 0.884, 0.394),
        sourceVertex(0.5, 1.099, 0.398),
      ], 6),
  },
  cookie7Sided: {
    androidName: 'Cookie7Sided',
    create: () => rotate(star(7, 0.75, 0.5), -90),
  },
  cookie9Sided: {
    androidName: 'Cookie9Sided',
    create: () => rotate(star(9, 0.8, 0.5), -90),
  },
  cookie12Sided: {
    androidName: 'Cookie12Sided',
    create: () => rotate(star(12, 0.8, 0.5), -90),
  },
  ghostish: {
    androidName: 'Ghostish',
    create: () =>
      custom(
        [
          sourceVertex(0.5, 0, 1),
          sourceVertex(1, 0, 1),
          sourceVertex(1, 1.14, 0.254, 0.106),
          sourceVertex(0.575, 0.906, 0.253),
        ],
        1,
        true,
      ),
  },
  clover4Leaf: {
    androidName: 'Clover4Leaf',
    create: () =>
      custom(
        [sourceVertex(0.5, 0.074), sourceVertex(0.725, -0.099, 0.476)],
        4,
        true,
      ),
  },
  clover8Leaf: {
    androidName: 'Clover8Leaf',
    create: () =>
      custom([
        sourceVertex(0.5, 0.036),
        sourceVertex(0.758, -0.101, 0.209),
      ], 8),
  },
  burst: {
    androidName: 'Burst',
    create: () =>
      custom([
        sourceVertex(0.5, -0.006, 0.006),
        sourceVertex(0.592, 0.158, 0.006),
      ], 12),
  },
  softBurst: {
    androidName: 'SoftBurst',
    create: () =>
      custom([
        sourceVertex(0.193, 0.277, 0.053),
        sourceVertex(0.176, 0.055, 0.053),
      ], 10),
  },
  boom: {
    androidName: 'Boom',
    create: () =>
      custom([
        sourceVertex(0.457, 0.296, 0.007),
        sourceVertex(0.5, -0.051, 0.007),
      ], 15),
  },
  softBoom: {
    androidName: 'SoftBoom',
    create: () =>
      custom(
        [
          sourceVertex(0.733, 0.454),
          sourceVertex(0.839, 0.437, 0.532),
          sourceVertex(0.949, 0.449, 0.439, 1),
          sourceVertex(0.998, 0.478, 0.174),
        ],
        16,
        true,
      ),
  },
  flower: {
    androidName: 'Flower',
    create: () =>
      custom(
        [
          sourceVertex(0.37, 0.187),
          sourceVertex(0.416, 0.049, 0.381),
          sourceVertex(0.479, 0.001, 0.095),
        ],
        8,
        true,
      ),
  },
  puffy: {
    androidName: 'Puffy',
    create: () =>
      scale(
        custom(
          [
            sourceVertex(0.5, 0.053),
            sourceVertex(0.545, -0.04, 0.405),
            sourceVertex(0.67, -0.035, 0.426),
            sourceVertex(0.717, 0.066, 0.574),
            sourceVertex(0.722, 0.128),
            sourceVertex(0.777, 0.002, 0.36),
            sourceVertex(0.914, 0.149, 0.66),
            sourceVertex(0.926, 0.289, 0.66),
            sourceVertex(0.881, 0.346),
            sourceVertex(0.94, 0.344, 0.126),
            sourceVertex(1.003, 0.437, 0.255),
          ],
          2,
          true,
        ),
        1,
        0.742,
      ),
  },
  puffyDiamond: {
    androidName: 'PuffyDiamond',
    create: () =>
      custom(
        [
          sourceVertex(0.87, 0.13, 0.146),
          sourceVertex(0.818, 0.357),
          sourceVertex(1, 0.332, 0.853),
        ],
        4,
        true,
      ),
  },
  pixelCircle: {
    androidName: 'PixelCircle',
    create: () =>
      custom(
        [
          sourceVertex(0.5, 0),
          sourceVertex(0.704, 0),
          sourceVertex(0.704, 0.065),
          sourceVertex(0.843, 0.065),
          sourceVertex(0.843, 0.148),
          sourceVertex(0.926, 0.148),
          sourceVertex(0.926, 0.296),
          sourceVertex(1, 0.296),
        ],
        2,
        true,
      ),
  },
  pixelTriangle: {
    androidName: 'PixelTriangle',
    create: () =>
      custom(
        [
          sourceVertex(0.11, 0.5),
          sourceVertex(0.113, 0),
          sourceVertex(0.287, 0),
          sourceVertex(0.287, 0.087),
          sourceVertex(0.421, 0.087),
          sourceVertex(0.421, 0.17),
          sourceVertex(0.56, 0.17),
          sourceVertex(0.56, 0.265),
          sourceVertex(0.674, 0.265),
          sourceVertex(0.675, 0.344),
          sourceVertex(0.789, 0.344),
          sourceVertex(0.789, 0.439),
          sourceVertex(0.888, 0.439),
        ],
        1,
        true,
      ),
  },
  bun: {
    androidName: 'Bun',
    create: () =>
      custom(
        [
          sourceVertex(0.796, 0.5),
          sourceVertex(0.853, 0.518, 1),
          sourceVertex(0.992, 0.631, 1),
          sourceVertex(0.968, 1, 1),
        ],
        2,
        true,
      ),
  },
  heart: {
    androidName: 'Heart',
    create: () =>
      custom(
        [
          sourceVertex(0.5, 0.268, 0.016),
          sourceVertex(0.792, -0.066, 0.958),
          sourceVertex(1.064, 0.276, 1),
          sourceVertex(0.501, 0.946, 0.129),
        ],
        1,
        true,
      ),
  },
} satisfies Record<MaterialExpressiveShapeName, MaterialShapeSourceDefinition>;

export const MATERIAL_SHAPE_SOURCE_DEFINITIONS = Object.freeze(definitions);
