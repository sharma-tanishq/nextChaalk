import { RGBAColor } from "../colors/interfaces";
import { PointerPosition } from "../pointer";
import { Maybe } from "../utils";
import { ElementShape, ElementType, StrokeStyle } from "./enums";

export interface Orientation {
  position: [number, number];
  dimensions: [number, number];
  scale: [number, number];
  rotation: number;
  lastClickTimestamp: number /** will keep track of 'zIndex' */;
}

export type BoardElement =
  | StrokeElement
  | Image
  | Video
  | PDF
  | Text
  | Button
  | Slider
  | NGon
  | Stroke
  | LoopStroke
  | LineSequence;

export type BoardAssetElement = Image | Video | Text | PDF;

export type BoardUIElement = Button | Slider;

export interface BaseElement {
  id: number;
  type: ElementType;
  opacity: number /** 0 to 1 */;
  isInitialized: boolean;
  orientation: Orientation;
}

/**
 * 1st Order Extensions from Base
 */

export interface StrokeElement extends BaseElement {
  strokeWidth: number;
  fillColor: RGBAColor;
  strokeColor: RGBAColor;
  strokeStyle: StrokeStyle;
  dashGap: number;
}

export interface AssetElement extends BaseElement {
  shape: ElementShape;
}

export interface UIElement extends BaseElement {
  onActiveDrag: (
    self: BoardElement,
    pointerDelta: PointerPosition,
    data?: number
  ) => void;
  onPointerActivated: (self: BoardElement, pointer: PointerPosition) => void;
  onPointerReleased: (self: BoardElement, pointer: PointerPosition) => void;
  isActive: number;
}

/**
 * 2nd Order Extensions from Base
 */
/** Assets */
export interface Image extends AssetElement {
  src: string;
}

export interface Video extends AssetElement {
  src: string;
  playing: boolean;
  speed: number;
  quality: number;
  seekToSecond: number;
}

export interface PDF extends AssetElement {
  src: string;
  page: number;
}

export interface FontInfo {
  name: string;
  size: number;
  color: string;
}

export interface Text extends AssetElement {
  content: string /** Should be in markdown */;
  font: FontInfo;
}

/** UI Elements */
export interface Button extends UIElement {
  iconSrc: string;
}

export interface Slider extends UIElement {
  value: number /** 0 to 1 */;
}

/** Strokes */
export interface NGon extends StrokeElement {
  sides: Maybe<number>;
}

export interface Stroke extends StrokeElement {
  points: [number, number][];
}

export interface LoopStroke extends StrokeElement {
  points: number[];
}

export interface LineSequence extends StrokeElement {
  points: number[];
}
