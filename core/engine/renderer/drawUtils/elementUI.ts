import {
  BoardElement,
  Button,
  Orientation,
  UIElement,
} from "../../elements/interfaces";
import {
  copyButton,
  deleteButton,
  rotateButton,
  resizeStick,
  rotateStick,
} from "../../elements/UIElements";
import { Corner } from "../../math/enums";
import {
  addVectors,
  getCornerFromOrientation,
  invertY,
  isPointInsideElement,
  padOrientation,
} from "../../math/utils";
import { PointerPosition } from "../../pointer";
import { Scene } from "../../scene/Scene";
import { getRectVertexBuffer } from "../../scene/utils";
import { Programs } from "../programs/programs";
import { drawImage } from "./image";
import { drawRectangle } from "./rectangle";

export const getOrientationfromOffset = (
  relative: Orientation,
  offset: Orientation
) => {
  const points = getRectVertexBuffer(offset);
  const offsetX = Math.max(points[0], points[2], points[4], points[6]);
  const offsetY = Math.max(points[1], points[3], points[5], points[7]);

  const [rX, rY] = relative.position;

  return {
    ...relative,
    position: [offsetX + rX, offsetY + rY],
  } as Orientation;
};

const getTransformStickOrientation = (
  resizeStick: Button,
  parent: BoardElement,
  corner: Corner
): Orientation => {
  switch (corner) {
    case Corner.topLeft:
      return {
        ...resizeStick.orientation,
        position: addVectors(
          getCornerFromOrientation(
            padOrientation(parent.orientation, [12, 12]),
            Corner.topLeft
          ),
          [-18, 18]
        ) as [number, number],
      };

    case Corner.bottomRight:
      return {
        ...resizeStick.orientation,
        position: addVectors(
          getCornerFromOrientation(
            padOrientation(parent.orientation, [12, 12]),
            Corner.bottomRight
          ),
          invertY(
            resizeStick.orientation.dimensions.map((e) => -e / 2) as [
              number,
              number
            ]
          )
        ) as [number, number],
      };
  }
  return resizeStick.orientation;
};

export const drawSelectedElementUI = (
  scene: Scene,
  programs: Programs,
  element: BoardElement
) => {
  /** dashed outline box */
  drawRectangle(
    scene,
    padOrientation(element.orientation, [12, 12]),
    [0, 0, 0, 0.2],
    [0, 0, 0, 1],
    6,
    1,
    programs!.nGonProgram,
    0.1
  );

  /** delete */
  drawImage(
    scene,
    deleteButton.id,
    deleteButton.iconSrc,
    getOrientationfromOffset(deleteButton.orientation, element.orientation),
    1,
    programs!.imageProgram,
    false
  );

  /** hard rotate */
  drawImage(
    scene,
    rotateButton.id,
    rotateButton.iconSrc,
    getOrientationfromOffset(rotateButton.orientation, element.orientation),
    1,
    programs!.imageProgram,
    false
  );

  /** copy */
  drawImage(
    scene,
    copyButton.id,
    copyButton.iconSrc,
    getOrientationfromOffset(copyButton.orientation, element.orientation),
    1,
    programs!.imageProgram,
    false
  );

  /**
   * Transform sticks
   */
  /** Bottom Right resize */
  drawImage(
    scene,
    resizeStick.id,
    resizeStick.iconSrc,
    getTransformStickOrientation(resizeStick, element, Corner.bottomRight),
    1,
    programs!.imageProgram,
    false
  );
  /** soft rotate top left */
  drawImage(
    scene,
    rotateStick.id,
    rotateStick.iconSrc,
    getTransformStickOrientation(rotateStick, element, Corner.topLeft),
    1,
    programs!.imageProgram,
    false
  );
};

const isUIElementSelectable = (
  pointer: PointerPosition,
  uIElement: UIElement,
  parentElement: BoardElement,
  orientation?: Orientation
) =>
  isPointInsideElement(
    [pointer.x, pointer.y],
    orientation ??
      getOrientationfromOffset(uIElement.orientation, parentElement.orientation)
  );

export const handleSelectionUIDrag = (
  element: BoardElement,
  pointerDelta: PointerPosition
) => {
  if (resizeStick.isActive)
    resizeStick.onActiveDrag(
      element,
      { x: pointerDelta.x, y: -pointerDelta.y },
      resizeStick.isActive
    );
  if (rotateStick.isActive)
    rotateStick.onActiveDrag(
      element,
      { x: pointerDelta.x, y: -pointerDelta.y },
      rotateStick.isActive
    );
};

export const handleSelectionUIActivation = (
  scene: Scene,
  element: BoardElement,
  pointer: PointerPosition
) => {
  if (scene.pendingPointerState.released) {
    resizeStick.isActive = 0;
    return false;
  }

  /** Handle Delete */
  if (isUIElementSelectable(pointer, deleteButton, element)) {
    scene.elements = scene.elements.filter((el) => el.id !== element.id);
    return true;
  }

  /** Handle Rotate */
  if (isUIElementSelectable(pointer, rotateButton, element)) {
    element.orientation.rotation -=
      element.orientation.rotation % (Math.PI / 2);
    element.orientation.rotation -= Math.PI / 2;
    element.orientation.rotation %= 2 * Math.PI;
    return true;
  }

  /** Handle Copy */
  if (isUIElementSelectable(pointer, copyButton, element)) {
    scene.nextId++;
    const clone = {
      ...element,
      orientation: {
        ...element.orientation,
        position: [
          element.orientation.position[0] + 60 * Math.random(),
          element.orientation.position[1] - 60 * Math.random(),
        ],
      },

      id: scene.nextId++,
    } as BoardElement;
    scene.elements.push(clone);
    return true;
  }

  /**
   * Transform sticks
   */
  /** Bottom right resize */
  if (
    isUIElementSelectable(
      pointer,
      resizeStick,
      element,
      getTransformStickOrientation(resizeStick, element, Corner.bottomRight)
    )
  ) {
    resizeStick.isActive = Corner.bottomRight;
    return true;
  }

  /** Top Left Rotate */
  if (
    isUIElementSelectable(
      pointer,
      rotateStick,
      element,
      getTransformStickOrientation(rotateStick, element, Corner.topLeft)
    )
  ) {
    rotateStick.isActive = Corner.topLeft;
    return true;
  }

  return false;
};
