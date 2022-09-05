import { ElementType, StrokeStyle } from "./enums";
import { BoardElement, Image, Stroke, Text } from "./interfaces";

const isInitialized = true;

export const sampleElements: BoardElement[] = [
  {
    id: 57,
    type: ElementType.Video,
    isInitialized,
    src: "/test.mp4",
    opacity: 1 /** 0 to 1 */,
    orientation: {
      position: [-400, -100],
      dimensions: [512 * 2, 480 * 2],
      scale: [1, 1],
      rotation: 0,
      lastClickTimestamp: Date.now(),
    },
  } as Image,
  {
    id: 1,
    type: ElementType.Image,
    isInitialized,
    src: "/test.jpg",
    opacity: 1 /** 0 to 1 */,

    orientation: {
      position: [400, -400],
      dimensions: [256, 256],
      scale: [1, 1],
      rotation: 0,
      lastClickTimestamp: Date.now(),
    },
  } as Image,
  {
    id: 2,
    type: ElementType.Image,
    isInitialized,
    src: "/test.jpg",
    opacity: 1 /** 0 to 1 */,

    orientation: {
      position: [-400, 400],
      dimensions: [256, 256],
      scale: [1, 1],
      rotation: 0,
      lastClickTimestamp: Date.now(),
    },
  } as Image,
  {
    id: 3,
    type: ElementType.Image,
    isInitialized,
    src: "/test.jpg",
    opacity: 1 /** 0 to 1 */,

    orientation: {
      position: [400, 400],
      dimensions: [256, 256],
      scale: [1, 1],
      rotation: 2,
      lastClickTimestamp: Date.now(),
    },
  } as Image,
  {
    id: 4,
    type: ElementType.Image,
    isInitialized,
    src: "/test.jpg",
    opacity: 1 /** 0 to 1 */,

    orientation: {
      position: [0, 400],
      dimensions: [256, 256],
      scale: [1, 1],
      rotation: 2,
      lastClickTimestamp: Date.now(),
    },
  } as Image,
  {
    id: 5,
    type: ElementType.Text,
    isInitialized: false,
    content: "lorem ipsum dolor sit amet.\nHello how are you :D\nhello\nsdfsdf",
    font: {
      name: "monospace",
      size: 30,
      color: "#063C2F",
    },
    opacity: 1 /** 0 to 1 */,

    orientation: {
      position: [0, 400],
      dimensions: [256, 256],
      scale: [1, 1],
      rotation: 0,
      lastClickTimestamp: Date.now(),
    },
  } as Text,
  {
    id: 5,
    type: ElementType.StrokeElement,
    isInitialized: false,
    points: [
      [0, 0],
      [200, 200],
      [400, 0],
      [400, 400],
      [500, 500],
      [600, 600],
      [700, 700],
    ],
    opacity: 1 /** 0 to 1 */,
    strokeWidth: 20,
    fillColor: [22, 148, 154, 1],
    strokeColor: [255, 108, 55, 1],
    strokeStyle: StrokeStyle.smooth,
    dashGap: 0,
    orientation: {
      position: [0, 400],
      dimensions: [256, 256],
      scale: [1, 1],
      rotation: 0,
      lastClickTimestamp: Date.now(),
    },
  } as Stroke,
];
