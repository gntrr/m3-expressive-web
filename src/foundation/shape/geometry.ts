import type {
  MaterialNormalizedShapeGeometry,
  MaterialShapeCubicSegment,
  MaterialShapePoint,
} from './types.js';

const DISTANCE_EPSILON = 1e-4;

export interface SourceRounding {
  readonly radius: number;
  readonly smoothing: number;
}

export interface SourceVertex {
  readonly point: MaterialShapePoint;
  readonly rounding: SourceRounding;
}

interface Cubic {
  readonly start: MaterialShapePoint;
  readonly control1: MaterialShapePoint;
  readonly control2: MaterialShapePoint;
  readonly end: MaterialShapePoint;
}

export function sourceRounding(
  radius = 0,
  smoothing = 0,
): SourceRounding {
  return { radius, smoothing };
}

export function sourceVertex(
  x: number,
  y: number,
  radius = 0,
  smoothing = 0,
): SourceVertex {
  return { point: { x, y }, rounding: sourceRounding(radius, smoothing) };
}

function add(a: MaterialShapePoint, b: MaterialShapePoint): MaterialShapePoint {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: MaterialShapePoint, b: MaterialShapePoint): MaterialShapePoint {
  return { x: a.x - b.x, y: a.y - b.y };
}

function multiply(point: MaterialShapePoint, factor: number): MaterialShapePoint {
  return { x: point.x * factor, y: point.y * factor };
}

function divide(point: MaterialShapePoint, divisor: number): MaterialShapePoint {
  return multiply(point, 1 / divisor);
}

function distance(point: MaterialShapePoint): number {
  return Math.hypot(point.x, point.y);
}

function direction(point: MaterialShapePoint): MaterialShapePoint {
  const magnitude = distance(point);
  if (magnitude <= 0) {
    throw new RangeError('shape direction requires a non-zero vector.');
  }
  return divide(point, magnitude);
}

function dot(a: MaterialShapePoint, b: MaterialShapePoint): number {
  return a.x * b.x + a.y * b.y;
}

function rotate90(point: MaterialShapePoint): MaterialShapePoint {
  return { x: -point.y, y: point.x };
}

function interpolatePoint(
  start: MaterialShapePoint,
  end: MaterialShapePoint,
  fraction: number,
): MaterialShapePoint {
  return {
    x: (1 - fraction) * start.x + fraction * end.x,
    y: (1 - fraction) * start.y + fraction * end.y,
  };
}

function straightLine(start: MaterialShapePoint, end: MaterialShapePoint): Cubic {
  return {
    start,
    control1: interpolatePoint(start, end, 1 / 3),
    control2: interpolatePoint(start, end, 2 / 3),
    end,
  };
}

function reverseCubic(cubic: Cubic): Cubic {
  return {
    start: cubic.end,
    control1: cubic.control2,
    control2: cubic.control1,
    end: cubic.start,
  };
}

function circularArc(
  center: MaterialShapePoint,
  start: MaterialShapePoint,
  end: MaterialShapePoint,
): Cubic {
  const startDirection = direction(subtract(start, center));
  const endDirection = direction(subtract(end, center));
  const rotatedStart = rotate90(startDirection);
  const rotatedEnd = rotate90(endDirection);
  const clockwise = dot(rotatedStart, subtract(end, center)) >= 0;
  const cosine = Math.max(-1, Math.min(1, dot(startDirection, endDirection)));

  if (cosine > 0.999) {
    return straightLine(start, end);
  }

  const k =
    (distance(subtract(start, center)) * 4) / 3 *
    ((Math.sqrt(2 * (1 - cosine)) - Math.sqrt(1 - cosine * cosine)) /
      (1 - cosine)) *
    (clockwise ? 1 : -1);

  return {
    start,
    control1: add(start, multiply(rotatedStart, k)),
    control2: subtract(end, multiply(rotatedEnd, k)),
    end,
  };
}

function pointOnCubic(cubic: Cubic, t: number): MaterialShapePoint {
  const u = 1 - t;
  return {
    x:
      cubic.start.x * u * u * u +
      cubic.control1.x * 3 * t * u * u +
      cubic.control2.x * 3 * t * t * u +
      cubic.end.x * t * t * t,
    y:
      cubic.start.y * u * u * u +
      cubic.control1.y * 3 * t * u * u +
      cubic.control2.y * 3 * t * t * u +
      cubic.end.y * t * t * t,
  };
}

function splitCubic(cubic: Cubic, t: number): readonly [Cubic, Cubic] {
  const u = 1 - t;
  const point = pointOnCubic(cubic, t);
  return [
    {
      start: cubic.start,
      control1: interpolatePoint(cubic.start, cubic.control1, t),
      control2: {
        x:
          cubic.start.x * u * u +
          cubic.control1.x * 2 * u * t +
          cubic.control2.x * t * t,
        y:
          cubic.start.y * u * u +
          cubic.control1.y * 2 * u * t +
          cubic.control2.y * t * t,
      },
      end: point,
    },
    {
      start: point,
      control1: {
        x:
          cubic.control1.x * u * u +
          cubic.control2.x * 2 * u * t +
          cubic.end.x * t * t,
        y:
          cubic.control1.y * u * u +
          cubic.control2.y * 2 * u * t +
          cubic.end.y * t * t,
      },
      control2: interpolatePoint(cubic.control2, cubic.end, t),
      end: cubic.end,
    },
  ];
}

function lineIntersection(
  lineStart: MaterialShapePoint,
  lineDirection: MaterialShapePoint,
  otherStart: MaterialShapePoint,
  otherDirection: MaterialShapePoint,
): MaterialShapePoint | undefined {
  const rotatedOther = rotate90(otherDirection);
  const denominator = dot(lineDirection, rotatedOther);
  if (Math.abs(denominator) < DISTANCE_EPSILON) return undefined;
  const numerator = dot(subtract(otherStart, lineStart), rotatedOther);
  if (Math.abs(denominator) < DISTANCE_EPSILON * Math.abs(numerator)) {
    return undefined;
  }
  return add(lineStart, multiply(lineDirection, numerator / denominator));
}

class RoundedCorner {
  readonly previous: MaterialShapePoint;
  readonly corner: MaterialShapePoint;
  readonly next: MaterialShapePoint;
  readonly firstDirection: MaterialShapePoint;
  readonly secondDirection: MaterialShapePoint;
  readonly radius: number;
  readonly smoothing: number;
  readonly expectedRoundCut: number;

  constructor(
    previous: MaterialShapePoint,
    corner: MaterialShapePoint,
    next: MaterialShapePoint,
    rounding: SourceRounding,
  ) {
    this.previous = previous;
    this.corner = corner;
    this.next = next;
    const firstVector = subtract(previous, corner);
    const secondVector = subtract(next, corner);
    const firstDistance = distance(firstVector);
    const secondDistance = distance(secondVector);

    if (firstDistance > 0 && secondDistance > 0) {
      this.firstDirection = divide(firstVector, firstDistance);
      this.secondDirection = divide(secondVector, secondDistance);
      this.radius = rounding.radius;
      this.smoothing = rounding.smoothing;
      const cosine = dot(this.firstDirection, this.secondDirection);
      const sine = Math.sqrt(Math.max(0, 1 - cosine * cosine));
      this.expectedRoundCut =
        sine > 1e-3 ? (this.radius * (cosine + 1)) / sine : 0;
    } else {
      this.firstDirection = { x: 0, y: 0 };
      this.secondDirection = { x: 0, y: 0 };
      this.radius = 0;
      this.smoothing = 0;
      this.expectedRoundCut = 0;
    }
  }

  get expectedCut(): number {
    return (1 + this.smoothing) * this.expectedRoundCut;
  }

  private actualSmoothing(allowedCut: number): number {
    if (allowedCut > this.expectedCut) return this.smoothing;
    if (allowedCut > this.expectedRoundCut) {
      return (
        (this.smoothing * (allowedCut - this.expectedRoundCut)) /
        (this.expectedCut - this.expectedRoundCut)
      );
    }
    return 0;
  }

  private flankingCurve(
    actualRoundCut: number,
    smoothing: number,
    sideStart: MaterialShapePoint,
    circleIntersection: MaterialShapePoint,
    otherCircleIntersection: MaterialShapePoint,
    circleCenter: MaterialShapePoint,
    actualRadius: number,
  ): Cubic {
    const sideDirection = direction(subtract(sideStart, this.corner));
    const curveStart = add(
      this.corner,
      multiply(sideDirection, actualRoundCut * (1 + smoothing)),
    );
    const midpoint = divide(add(circleIntersection, otherCircleIntersection), 2);
    const proportionalPoint = interpolatePoint(circleIntersection, midpoint, smoothing);
    const curveEnd = add(
      circleCenter,
      multiply(direction(subtract(proportionalPoint, circleCenter)), actualRadius),
    );
    const tangent = rotate90(subtract(curveEnd, circleCenter));
    const endControl =
      lineIntersection(sideStart, sideDirection, curveEnd, tangent) ??
      circleIntersection;
    const startControl = divide(add(curveStart, multiply(endControl, 2)), 3);
    return {
      start: curveStart,
      control1: startControl,
      control2: endControl,
      end: curveEnd,
    };
  }

  cubics(allowedCut0: number, allowedCut1 = allowedCut0): readonly Cubic[] {
    const allowedCut = Math.min(allowedCut0, allowedCut1);
    if (
      this.expectedRoundCut < DISTANCE_EPSILON ||
      allowedCut < DISTANCE_EPSILON ||
      this.radius < DISTANCE_EPSILON
    ) {
      return [straightLine(this.corner, this.corner)];
    }

    const actualRoundCut = Math.min(allowedCut, this.expectedRoundCut);
    const actualRadius =
      (this.radius * actualRoundCut) / this.expectedRoundCut;
    const centerDistance = Math.hypot(actualRadius, actualRoundCut);
    const circleCenter = add(
      this.corner,
      multiply(
        direction(divide(add(this.firstDirection, this.secondDirection), 2)),
        centerDistance,
      ),
    );
    const firstIntersection = add(
      this.corner,
      multiply(this.firstDirection, actualRoundCut),
    );
    const secondIntersection = add(
      this.corner,
      multiply(this.secondDirection, actualRoundCut),
    );
    const firstFlank = this.flankingCurve(
      actualRoundCut,
      this.actualSmoothing(allowedCut0),
      this.previous,
      firstIntersection,
      secondIntersection,
      circleCenter,
      actualRadius,
    );
    const secondFlank = reverseCubic(
      this.flankingCurve(
        actualRoundCut,
        this.actualSmoothing(allowedCut1),
        this.next,
        secondIntersection,
        firstIntersection,
        circleCenter,
        actualRadius,
      ),
    );
    return [
      firstFlank,
      circularArc(circleCenter, firstFlank.end, secondFlank.start),
      secondFlank,
    ];
  }
}

function isZeroLength(cubic: Cubic): boolean {
  return (
    Math.abs(cubic.start.x - cubic.end.x) < DISTANCE_EPSILON &&
    Math.abs(cubic.start.y - cubic.end.y) < DISTANCE_EPSILON
  );
}

function roundedCubics(vertices: readonly SourceVertex[]): readonly Cubic[] {
  const count = vertices.length;
  if (count < 3) throw new RangeError('Material shapes require at least three vertices.');

  const corners = vertices.map(
    (vertex, index) =>
      new RoundedCorner(
        vertices[(index + count - 1) % count]!.point,
        vertex.point,
        vertices[(index + 1) % count]!.point,
        vertex.rounding,
      ),
  );

  const cutAdjustments = corners.map((corner, index) => {
    const next = corners[(index + 1) % count]!;
    const expectedRoundCut = corner.expectedRoundCut + next.expectedRoundCut;
    const expectedCut = corner.expectedCut + next.expectedCut;
    const sideLength = distance(
      subtract(vertices[index]!.point, vertices[(index + 1) % count]!.point),
    );
    if (expectedRoundCut > sideLength) {
      return { roundRatio: sideLength / expectedRoundCut, cutRatio: 0 };
    }
    if (expectedCut > sideLength) {
      return {
        roundRatio: 1,
        cutRatio: (sideLength - expectedRoundCut) / (expectedCut - expectedRoundCut),
      };
    }
    return { roundRatio: 1, cutRatio: 1 };
  });

  const cornerCubics = corners.map((corner, index) => {
    const allowedCuts = [0, 1].map((delta) => {
      const adjustment = cutAdjustments[(index + count - 1 + delta) % count]!;
      return (
        corner.expectedRoundCut * adjustment.roundRatio +
        (corner.expectedCut - corner.expectedRoundCut) * adjustment.cutRatio
      );
    });
    return corner.cubics(allowedCuts[0]!, allowedCuts[1]!);
  });

  const features: (readonly Cubic[])[] = [];
  for (let index = 0; index < count; index += 1) {
    features.push(cornerCubics[index]!);
    features.push([
      straightLine(
        cornerCubics[index]!.at(-1)!.end,
        cornerCubics[(index + 1) % count]![0]!.start,
      ),
    ]);
  }

  let splitStart: readonly Cubic[] | undefined;
  let splitEnd: readonly Cubic[] | undefined;
  if (features[0]!.length === 3) {
    const [start, end] = splitCubic(features[0]![1]!, 0.5);
    splitStart = [features[0]![0]!, start];
    splitEnd = [end, features[0]![2]!];
  }

  const flattened: Cubic[] = [];
  let first: Cubic | undefined;
  let last: Cubic | undefined;
  for (let index = 0; index <= features.length; index += 1) {
    const feature =
      index === 0 && splitEnd
        ? splitEnd
        : index === features.length
          ? splitStart
          : features[index];
    if (!feature) break;

    for (const cubic of feature) {
      if (!isZeroLength(cubic)) {
        if (last) flattened.push(last);
        last = cubic;
        first ??= cubic;
      } else if (last) {
        last = { ...last, end: cubic.end };
      }
    }
  }

  if (!first || !last) {
    const point = vertices[0]!.point;
    return [straightLine(point, point)];
  }
  flattened.push({ ...last, end: first.start });
  return flattened;
}

function stableCoordinate(value: number): number {
  const rounded = Number(value.toFixed(9));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function freezePoint(point: MaterialShapePoint): MaterialShapePoint {
  return Object.freeze({
    x: stableCoordinate(point.x),
    y: stableCoordinate(point.y),
  });
}

/**
 * Translates canonical source vertices into normalized cubic geometry using the
 * same corner construction and control-point-bound normalization as AndroidX.
 */
export function createNormalizedGeometry(
  vertices: readonly SourceVertex[],
  center: MaterialShapePoint,
): MaterialNormalizedShapeGeometry {
  const cubics = roundedCubics(vertices);
  const points = cubics.flatMap((cubic) => [
    cubic.start,
    cubic.control1,
    cubic.control2,
    cubic.end,
  ]);
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(...points.map((point) => point.x));
  const maxY = Math.max(...points.map((point) => point.y));
  const width = maxX - minX;
  const height = maxY - minY;
  const side = Math.max(width, height);
  if (side <= 0) throw new RangeError('Material shape geometry must have positive area.');
  const offsetX = (side - width) / 2 - minX;
  const offsetY = (side - height) / 2 - minY;
  const normalize = (point: MaterialShapePoint): MaterialShapePoint =>
    freezePoint({ x: (point.x + offsetX) / side, y: (point.y + offsetY) / side });

  const segments = Object.freeze(
    cubics.map(
      (cubic): MaterialShapeCubicSegment =>
        Object.freeze({
          start: normalize(cubic.start),
          control1: normalize(cubic.control1),
          control2: normalize(cubic.control2),
          end: normalize(cubic.end),
        }),
    ),
  );

  return Object.freeze({
    kind: 'cubic-path',
    viewBox: Object.freeze([0, 0, 1, 1] as const),
    center: normalize(center),
    closed: true,
    segments,
    classification: 'translated',
  });
}
