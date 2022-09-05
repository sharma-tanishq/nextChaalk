import { BoardElement, Orientation } from "../elements/interfaces";
import { rotatePoint } from "../math/utils";
import { Scene } from "./Scene";

export const getRectVertexBuffer = (
  orientation: Orientation
): [number, number, number, number, number, number, number, number] => {
  const { position, dimensions } = orientation;
  const [x, y] = position;
  const [width, height] = dimensions;
  const center = [x + width / 2, y - height / 2] as [number, number];
  const angle = orientation.rotation;

  return [
    // Top Left
    ...rotatePoint([x, y], center, angle),

    // Top Right
    ...rotatePoint([x + width, y], center, angle),

    // Bottom Left
    ...rotatePoint([x, y - height], center, angle),

    // Bottom Right
    ...rotatePoint([x + width, y - height], center, angle),
  ];
};

export const modifyElements = (
  scene: Scene,
  objectIds: number[],
  modifier: (el: BoardElement) => void
) => {
  scene.elements.forEach((el) => {
    if (objectIds.includes(el.id)) {
      modifier(el);
    }
  });
};

export const endActiveDrawElement = (scene: Scene, discard = false) => {
  if (!scene.activeDrawElement) return;
  const [width, height] = scene.activeDrawElement.orientation.dimensions;
  if (!discard && Math.abs(width * height) > 20)
    scene.elements.push(scene.activeDrawElement);
  scene.activeDrawElement = undefined;
};
