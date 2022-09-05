import { mat3, mat4 } from "gl-matrix";
import { BoardElement, Orientation } from "../elements/interfaces";
import { PointerPosition } from "../pointer";
import { Scene } from "../scene/Scene";
import { getRectVertexBuffer } from "../scene/utils";
import { Corner } from "./enums";

export const getQuadrant = (
  point: [number, number],
  center: [number, number],
  angle = 0
) => {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  /** shift the origin to center */
  point = [point[0] - center[0], point[1] - center[1]];
  /** rotate about origin */
  point = [point[0] * c - point[1] * s, point[0] * s + point[1] * c];

  if (point[0] >= 0 && point[1] >= 0) return Corner.topRight;
  if (point[0] <= 0 && point[1] >= 0) return Corner.topLeft;
  if (point[0] <= 0 && point[1] <= 0) return Corner.bottomLeft;
  if (point[0] >= 0 && point[1] <= 0) return Corner.bottomRight;
};

export const invertY = (vec: [number, number]): [number, number] => [
  vec[0],
  -vec[1],
];

export const addVectors = (...vecs: number[][]) => {
  const newVec = [] as number[];

  for (let i = 0; i < vecs[0].length; i++) {
    let sum = 0;
    vecs.forEach((el) => {
      sum += el[i];
    });
    newVec.push(sum);
  }

  return newVec;
};

export const getCornerFromOrientation = (
  orientation: Orientation,
  corner: Corner
): [number, number] => {
  const { position, dimensions } = orientation;
  const [x, y] = position;
  const [width, height] = dimensions;
  const center = [x + width / 2, y - height / 2] as [number, number];
  const angle = orientation.rotation;

  let point: [number, number];
  switch (corner) {
    case Corner.topLeft:
      point = [x, y];
      break;
    case Corner.topRight:
      point = [x + width, y];
      break;
    case Corner.bottomLeft:
      point = [x, y - height];
      break;
    case Corner.bottomRight:
      point = [x + width, y - height];
      break;
  }

  return rotatePoint(point, center, angle);
};

/**
 * @param points Points of the triangle,
 * In the trend, x1, y1, x2, y2, x3, y3
 * @returns Area of the triangle
 */
export const areaOfTriangle = (
  points: [number, number, number, number, number, number]
) =>
  0.5 *
  mat3.determinant(
    mat3.fromValues(
      points[0],
      points[1],
      1,
      points[2],
      points[3],
      1,
      points[4],
      points[5],
      1
    )
  );

/**
 * Rotates a point
 * @param point The point to rotate
 * @param center The origin to rotate about
 * @param angle The angle to rotate by
 * @returns The rotated point
 */
export const rotatePoint = (
  point: [number, number],
  center: [number, number],
  angle: number
) => {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  /** shift the origin to center */
  point = [point[0] - center[0], point[1] - center[1]];
  /** rotate about origin */
  point = [point[0] * c - point[1] * s, point[0] * s + point[1] * c];
  /** unshift the origin from center */
  point = [point[0] + center[0], point[1] + center[1]];

  return point;
};

/**
 * @param point The point to test for
 * @param orientation Orientation of the Element
 * @returns Whether the point is inside the Element
 */
export const isPointInsideElement = (
  point: [number, number],
  orientation: Orientation
) => {
  const { position, dimensions, rotation, scale } = orientation;
  /** get all distinct point values of a rectangle */
  const [x1, y1] = position;
  const x2 = position[0] + dimensions[0] * scale[0];
  const y2 = position[1] - dimensions[1] * scale[1];

  /** get the reverse rotated query point's values */
  const [x, y] = rotatePoint(point, [(x1 + x2) / 2, (y1 + y2) / 2], -rotation);

  const checkFlags = [1, 1];

  if (x > x1) checkFlags[0] *= -1;
  if (x > x2) checkFlags[0] *= -1;
  if (y > y1) checkFlags[1] *= -1;
  if (y > y2) checkFlags[1] *= -1;

  return checkFlags[0] === -1 && checkFlags[1] === -1;
};

/**
 * @param orientation Orientation of the Element
 * @returns co-ordinates of the center of the rectangle
 */
export const getCenterOfElement = (orientation: Orientation) => {
  const { position, dimensions, scale } = orientation;
  const [x1, y1] = position;
  const x2 = position[0] + dimensions[0] * scale[0];
  const y2 = position[1] - dimensions[1] * scale[1];
  return [(x1 + x2) / 2, (y1 + y2) / 2] as [number, number];
};

/**
 * @param center Co-ordinates of the center of the rectangle
 * @param dimensions [width, height] of the rectangle
 * @param scale scaling vector of the rectangle
 * @returns co-ordinates of the top-left point of the rectangle
 */
export const getPositionOfRect = (
  center: [number, number],
  dimensions: [number, number],
  scale: [number, number] = [1, 1]
) => {
  const x = center[0] - (dimensions[0] * scale[0]) / 2;
  const y = center[1] + (dimensions[1] * scale[1]) / 2;
  return [x, y] as [number, number];
};

/**
 * Moves a point in such a way that the distance
 * between itself and a center becomes a given factor
 * times the initial.
 * Movement is along the center vs given point line
 * @param point The Point to move
 * @param center The fixed center point
 * @param factor the amount to move
 * @returns moved / new point
 */
export const lerp = (
  point: [number, number],
  center: [number, number],
  factor: number
) => {
  const x = (1 - factor) * center[0] + factor * point[0];
  const y = (1 - factor) * center[1] + factor * point[1];
  return [x, y];
};

/**
 * Calculates the distance between 2 2D points
 * @param pointA
 * @param pointB
 * @returns The distance between point A and point B
 */
export const distance = (pointA: [number, number], pointB: [number, number]) =>
  Math.hypot(pointA[0] - pointB[0], pointA[1] - pointB[1]);

export const shiftToViewMatrix = (
  pointer: PointerPosition,
  canvas: HTMLCanvasElement,
  view: mat4
) => {
  const viewScaling = mat4.getScaling([0, 0, 0], view);
  const viewTranslation = mat4.getTranslation([0, 0, 0], view);
  const position = [pointer.x / canvas.width, pointer.y / canvas.height];
  // console.log(viewScaling);
  const x = (position[0] - viewTranslation[0]) * canvas.width;
  const y = (position[1] - viewTranslation[1]) * canvas.height;
  return { x, y } as PointerPosition;
};

export const scalePointByDevicePixelRatio = (
  point: [number, number],
  inverse = false
) => {
  return inverse
    ? [point[0] / window.devicePixelRatio, point[1] / window.devicePixelRatio]
    : [point[0] * window.devicePixelRatio, point[1] * window.devicePixelRatio];
};

export const pushOrRemove = <T>(arr: T[], item: T) => {
  if (arr.includes(item)) {
    return arr.filter((el) => el !== item);
  } else {
    return [...arr, item];
  }
};

export const padOrientation = (
  orientation: Orientation,
  padding: [number, number]
) => {
  const { position, dimensions } = orientation;
  const newPosition = [
    position[0] - padding[0] * Math.sign(dimensions[0]),
    position[1] + padding[1] * Math.sign(dimensions[1]),
  ];
  const newDimensions = [
    dimensions[0] + padding[0] * 2 * Math.sign(dimensions[0]),
    dimensions[1] + padding[1] * 2 * Math.sign(dimensions[1]),
  ];
  return {
    ...orientation,
    position: newPosition,
    dimensions: newDimensions,
  } as Orientation;
};

export const areArraysEqual = <T>(arr1: T[], arr2: T[]) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

export const isElementInsideFrame = (
  canvas: HTMLCanvasElement,
  view: Scene["view"],
  element: BoardElement
) => {
  const [minAx, minAy] = Object.values(
    shiftToViewMatrix({ x: -canvas.width, y: -canvas.height }, canvas, view)
  );
  const [maxAx, maxAy] = Object.values(
    shiftToViewMatrix({ x: canvas.width, y: canvas.height }, canvas, view)
  );

  const points = getRectVertexBuffer(element.orientation);
  const maxBx = Math.max(points[0], points[2], points[4], points[6]);
  const maxBy = Math.max(points[1], points[3], points[5], points[7]);
  const minBx = Math.min(points[0], points[2], points[4], points[6]);
  const minBy = Math.min(points[1], points[3], points[5], points[7]);

  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy;
};
