import { vec2 } from "gl-matrix";
import { Corner } from "../math/enums";
import { addVectors, invertY, rotatePoint } from "../math/utils";
import { PointerPosition } from "../pointer";
import {
  defaultOnActiveDrag,
  defaultOnPointerActivated,
  defaultOnPointerReleased,
} from "./elements";
import { ElementType } from "./enums";
import { BoardElement, Button } from "./interfaces";

export const deleteButton = {
  id: -1,
  type: ElementType.Button,
  isActive: 0,
  iconSrc: "/engineUI_Icons/delete.png",
  opacity: 1 /** 0 to 1 */,
  onActiveDrag: defaultOnActiveDrag,
  onPointerActivated: defaultOnPointerActivated,
  onPointerReleased: defaultOnPointerReleased,
  orientation: {
    position: [20, 30],
    dimensions: [70, 70],
    scale: [1, 1],
    rotation: 0,
    lastClickTimestamp: Date.now(),
  },
} as Button;

export const rotateButton = {
  id: -2,
  type: ElementType.Button,
  isActive: 0,
  iconSrc: "/engineUI_Icons/rotate.png",
  opacity: 1 /** 0 to 1 */,
  onActiveDrag: defaultOnActiveDrag,
  onPointerActivated: defaultOnPointerActivated,
  onPointerReleased: defaultOnPointerReleased,
  orientation: {
    position: [25, 30 - 70],
    dimensions: [60, 60],
    scale: [1, 1],
    rotation: 0,
    lastClickTimestamp: Date.now(),
  },
} as Button;

export const copyButton = {
  id: -3,
  type: ElementType.Button,
  isActive: 0,
  iconSrc: "/engineUI_Icons/copy.png",
  opacity: 1 /** 0 to 1 */,
  onActiveDrag: defaultOnActiveDrag,
  onPointerActivated: defaultOnPointerActivated,
  onPointerReleased: defaultOnPointerReleased,
  orientation: {
    position: [20 + 70, 30],
    dimensions: [60, 60],
    scale: [1, 1],
    rotation: 0,
    lastClickTimestamp: Date.now(),
  },
} as Button;

export const resizeStick = {
  id: -4,
  type: ElementType.TransformStick,
  isActive: 0,
  iconSrc: "/engineUI_Icons/transform_stick.png",
  opacity: 1 /** 0 to 1 */,
  onActiveDrag: (
    self: BoardElement,
    pointerDelta: PointerPosition,
    corner: Corner
  ) => {
    const delta = rotatePoint(
      Object.values(pointerDelta) as [number, number],
      [0, 0],
      -self.orientation.rotation
    );

    switch (corner) {
      case Corner.topLeft:
        /** Counter Drag */
        self.orientation.position = addVectors(
          self.orientation.position,
          rotatePoint(invertY(delta), [0, 0], -self.orientation.rotation)
        ) as [number, number];

        self.orientation.dimensions = addVectors(
          self.orientation.dimensions,
          delta.map((e) => -e)
        ) as [number, number];
        break;
      case Corner.bottomRight:
        self.orientation.dimensions = addVectors(
          self.orientation.dimensions,
          rotatePoint(delta, [0, 0], self.orientation.rotation)
        ) as [number, number];
        break;
    }
  },
  onPointerActivated: defaultOnPointerActivated,
  onPointerReleased: defaultOnPointerReleased,
  orientation: {
    position: [-15 + 3, 15 - 3],
    dimensions: [40, 40],
    scale: [1, 1],
    rotation: 0,
    lastClickTimestamp: Date.now(),
  },
} as Button;

export const rotateStick = {
  id: -5,
  type: ElementType.TransformStick,
  isActive: 0,
  iconSrc: "/engineUI_Icons/transform_stick.png",
  opacity: 1 /** 0 to 1 */,
  onActiveDrag: (
    self: BoardElement,
    pointerDelta: PointerPosition,
    corner: Corner
  ) => {
    const delta = Object.values(pointerDelta) as [number, number];
    const [width, height] = self.orientation.dimensions;

    let radialVector: [number, number];
    switch (corner) {
      case Corner.topLeft:
        radialVector = [-width, height];
        break;
      case Corner.topRight:
        radialVector = [width, height];
        break;
      case Corner.bottomRight:
        radialVector = [width, -height];
        break;
      case Corner.bottomLeft:
        radialVector = [-width, -height];
        break;
    }

    radialVector = vec2.normalize(
      radialVector,
      rotatePoint(radialVector, [0, 0], self.orientation.rotation)
    ) as [number, number];

    const angularShift = vec2.cross(
      [0, 0, 0],
      radialVector,
      vec2.normalize(delta, delta) as [number, number]
    )[2];

    self.orientation.rotation -= angularShift / 10;
  },
  onPointerActivated: defaultOnPointerActivated,
  onPointerReleased: defaultOnPointerReleased,
  orientation: {
    position: [-15 + 3, 15 - 3],
    dimensions: [40, 40],
    scale: [1, 1],
    rotation: 0,
    lastClickTimestamp: Date.now(),
  },
} as Button;
