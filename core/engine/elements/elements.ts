import { PointerPosition } from "../pointer";
import { Scene } from "../scene/Scene";
import { ElementType, StrokeStyle } from "./enums";
import {
  BaseElement,
  BoardElement,
  Image,
  NGon,
  Orientation,
  Stroke,
  Video,
} from "./interfaces";

export const defaultOnActiveDrag = (
  self: BoardElement,
  pointerDelta: PointerPosition
) => {
  self.orientation.lastClickTimestamp = Date.now();
  const [x, y] = self.orientation.position;
  self.orientation.position = [x + pointerDelta.x, y + pointerDelta.y];
};

export const defaultOnPointerActivated = (
  self: BoardElement,
  pointer: PointerPosition
) => {};

export const defaultOnPointerReleased = (
  self: BoardElement,
  pointer: PointerPosition
) => {};

export const makeBaseElement = (
  scene: Scene,
  options: Partial<BoardElement> & Partial<Orientation> = {}
) => {
  return {
    id: scene.nextId++,
    opacity: options.opacity ?? 1,
    isInitialized: false,
    orientation: {
      position: options.position ?? [0, 0],
      dimensions: options.dimensions ?? [256, 256],
      scale: options.scale ?? [1, 1],
      rotation: options.rotation ?? 0,
      lastClickTimestamp: Date.now(),
    },
  } as BaseElement;
};

/**
 * A singular element is returned (if at all) for a singular id
 *
 * An array of elements are returned for an array of ids
 * @param elements The elements of the scene
 * @param ids A singular Id or an array of ids
 * @returns The elements corresponding to those ids | null if nothing matches
 */
export const getElementById = (
  elements: Scene["elements"],
  ids: number | number[]
) => {
  if (typeof ids === "number") ids = [ids];

  const elementsFound = elements.filter((el) =>
    (ids as number[]).includes(el.id)
  );

  if (elementsFound.length === 0) return null;
  return elementsFound.length === 1 ? elementsFound[0] : elementsFound;
};

/**
 * Adds an Image to the Scene
 * @param scene The Scene
 * @param src Source of the image
 * @param options Any other desirable options
 */
export const addImage = (
  scene: Scene,
  src: string,
  options: Partial<Image> & Partial<Orientation> = {},
  addElementToScene = true
) => {
  const newImage = {
    ...makeBaseElement(scene, options),
    type: ElementType.Image,
    src,
  } as Image;

  if (addElementToScene) scene.elements.push(newImage);
  return newImage;
};

/**
 * Adds Video to the Scene
 * @param scene The Scene
 * @param src Source of the video
 * @param options Any other desirable options
 */
export const addVideo = (
  scene: Scene,
  src: string,
  options: Partial<Video> & Partial<Orientation> = {},
  addElementToScene = true
) => {
  const newVideo = {
    ...makeBaseElement(scene, options),
    type: ElementType.Video,
    src,
    playing: true,
    speed: 1,
    quality: 1,
    seekToSecond: 1,
  } as Video;

  if (addElementToScene) scene.elements.push(newVideo);
  return newVideo;
};

export const addRectangle = (
  scene: Scene,
  options: Partial<NGon> & Partial<Orientation> = {},
  addElementToScene = true
) => {
  const newRectangle = {
    ...makeBaseElement(scene, options),
    type: ElementType.Rectangle,
    sides: 4,
    strokeWidth: options.strokeWidth ?? 2,
    fillColor: options.fillColor ?? [22 / 255, 148 / 255, 154 / 255, 1.0],
    strokeColor: options.strokeColor ?? [22 / 255, 148 / 255, 154 / 255, 1.0],
    strokeStyle: options.strokeStyle ?? StrokeStyle.smooth,
    dashGap: options.dashGap ?? 0,
  } as NGon;

  if (addElementToScene) scene.elements.push(newRectangle);
  return newRectangle;
};

export const addStroke = (
  scene: Scene,
  options: Partial<Stroke> & Partial<Orientation> = {},
  addElementToScene = true
) => {
  const newStroke = {
    ...makeBaseElement(scene, options),
    type: ElementType.StrokeElement,
    points: options.points ?? [],
    strokeWidth: options.strokeWidth ?? 2,
    fillColor: options.fillColor ?? [22 / 255, 148 / 255, 154 / 255, 1.0],
    strokeColor: options.strokeColor ?? [22 / 255, 148 / 255, 154 / 255, 1.0],
    strokeStyle: options.strokeStyle ?? StrokeStyle.smooth,
    dashGap: options.dashGap ?? 0,
  } as Stroke;

  if (addElementToScene) scene.elements.push(newStroke);
  return newStroke;
};
