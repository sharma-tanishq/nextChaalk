import {
  getCachedVideoDomElement,
  getCachedVideoTexture,
} from "../../../caches/video";
import { ElementType } from "../../elements/enums";
import {
  BoardElement,
  NGon,
  Video,
  Image,
  Text,
  Stroke,
} from "../../elements/interfaces";
import { Scene } from "../../scene/Scene";
import { updateVideoTexture } from "../../textures/video";
import { Programs } from "../programs/programs";
import { drawImage } from "./image";
import { drawRectangle } from "./rectangle";
import { drawStroke, getStrokeInfo } from "./stroke";
import { drawText } from "./text";

let updatedSrcs = [] as string[];

export const drawElement = (
  scene: Scene,
  element: BoardElement,
  programs: Programs,
  deferVideo = false
) => {
  updatedSrcs = [];
  switch (element.type) {
    case ElementType.Video:
      const videoDom = getCachedVideoDomElement((element as Video).src);
      if (
        videoDom &&
        !deferVideo &&
        !updatedSrcs.includes((element as Video).src)
      ) {
        updatedSrcs.push((element as Video).src);
        updateVideoTexture(
          scene.gl,
          getCachedVideoTexture((element as Video).src)!,
          videoDom
        );
      }
      drawImage(
        scene,
        element.id,
        (element as Image).src,
        element.orientation,
        element.opacity,
        programs!.imageProgram,
        true
      );
      break;
    case ElementType.Image:
      drawImage(
        scene,
        element.id,
        (element as Image).src,
        element.orientation,
        element.opacity,
        programs!.imageProgram
      );
      break;
    case ElementType.Text:
      drawText(
        scene,
        element.id,
        (element as Text).content,
        (element as Text).font,
        element.orientation,
        element.opacity,
        programs!.imageProgram
      );
      break;
    case ElementType.StrokeElement:
      drawStroke(
        scene,
        element.id,
        getStrokeInfo((element as Stroke)),
        element.orientation,
        element.opacity,
        programs!.imageProgram
      );
      break;
    case ElementType.Rectangle:
      drawRectangle(
        scene,
        element.orientation,
        (element as NGon).fillColor,
        (element as NGon).strokeColor,
        (element as NGon).strokeWidth,
        element.opacity,
        programs!.nGonProgram,
        (element as NGon).dashGap
      );
      break;
  }
};
