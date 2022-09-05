import { mat4 } from "gl-matrix";

export interface PointerPosition {
  x: number;
  y: number;
}

/**
 * this is the vector from the canvas' center
 * to the mouse pointer
 */
let pointerPosition = { x: -1, y: -1 } as PointerPosition;
let pointerDelta = { x: -1, y: -1 } as PointerPosition;

/**
 * @returns The current pointer position
 */
export const getPointerPosition = (component?: "x" | "y") =>
  component ? pointerPosition[component] : pointerPosition;

/**
 * @returns The current pointer delta
 */
export const getPointerDelta = (component?: "x" | "y") =>
  component ? pointerDelta[component] : pointerDelta;

/**
 * @param moveEvent touchmove or mousemove
 * @param canvas the canvas element
 */
export const keepTrackOfPointer = (
  moveEvent: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement | null,
  view: mat4
) => {
  if (!canvas) return;

  /** ( a, b ) is the center of the canvas */
  const a = canvas.offsetLeft + canvas.offsetWidth / 2;
  const b = canvas.offsetTop + canvas.offsetHeight / 2;

  /** ( x, y ) is the current pointer position on the page */
  const x =
    (moveEvent as MouseEvent).pageX ??
    (moveEvent as TouchEvent).changedTouches[0].pageX;
  const y =
    (moveEvent as MouseEvent).pageY ??
    (moveEvent as TouchEvent).changedTouches[0].pageY;

  const tmp = mat4.create();
  mat4.invert(tmp, view);
  mat4.translate(tmp, tmp, [x, y, 1]);
  const coords = mat4.getTranslation(
    [0, 0, 0],
    mat4.scale(tmp, tmp, mat4.getScaling([0, 0, 0], tmp))
  );

  const oldPointerPosition = pointerPosition;

  /** set the pointer position */
  pointerPosition = {
    x: 2 * (coords[0] - a),
    y: 2 * (b - coords[1]),
  };

  /** set the pointer delta */
  const newDeltax = pointerPosition.x - oldPointerPosition.x;
  const newDeltay = pointerPosition.y - oldPointerPosition.y;

  /** to avoid jarring deltas */

  /**
   * Jarring deltas only happen in touch,
   * they occur due to our inability to track non-dragging
   * pointer movements.
   * A simple but slightly inaccurate fix here is simply don't allow
   * deltas above a certain value.
   * It also, however, messes things up when deltas are 'supposed' to be
   * large,
   * like at high speed dragging.
   * Meanwhile still causing jerky deltas below the set threshold.
   *
   * For all this, the problem is imperceptible for all practical reasons.
   *
   * A complete fix would be lookin at when deltas are caused by offscreen
   * finger / stylus movements and just invalidating those.
   *
   * That will, however, take longer to implement so I'm leaving it be for now.
   * Remove this comment once a complete fix has been done.
   */
  if (
    !(moveEvent as MouseEvent).pageX &&
    Math.abs(newDeltax) + Math.abs(newDeltay) > 100
  ) {
    pointerDelta = {
      x: 0,
      y: 0,
    };
  } else {
    pointerDelta = {
      x: newDeltax,
      y: newDeltay,
    };
  }
};

/**
 * @param pagePoint point co-ordinates w.r.t. the page
 * @param canvas the frame of reference canvas
 * @returns point shifted w.r.t. the canvas
 */
export const pageCoordsToCanvas = (
  pagePoint: [number, number],
  canvas: HTMLCanvasElement
) => {
  const [x, y] = pagePoint;
  const a = canvas.offsetLeft + canvas.offsetWidth / 2;
  const b = canvas.offsetTop + canvas.offsetHeight / 2;

  return [x - a, b - y] as [number, number];
};
