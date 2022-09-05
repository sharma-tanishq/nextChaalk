import { getCachedTexture } from "../../../caches/texture";
import { FontInfo, Orientation } from "../../elements/interfaces";
import { Scene } from "../../scene/Scene";
import { drawImage } from "./image";

export {};

export const markdownToSVG = () => {};

let textWidthCanvas: HTMLCanvasElement;

const getTextWidth = (text: string, font: string) => {
  const canvas =
    textWidthCanvas || (textWidthCanvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

export const textToSvg = (text: string, info: FontInfo) => {
  const lines = text.split("\n");
  const contentMax = lines.reduce((a, b) => (a.length > b.length ? a : b));
  const contentWidth = getTextWidth(contentMax, `${info.size}pt ${info.name}`);
  const template = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${(5 * contentWidth) / 1.3}"
    height="${5 * lines.length * info.size}"
    viewBox="0 0 ${contentWidth / 1.3} ${info.size * lines.length}">
    <style>
    .overall {
        fill: ${info.color};
        font: ${info.size}px ${info.name};
    }
    </style>
    ${lines
      .map(
        (el, i) =>
          `<text class="overall" x="5" y="${
            -info.size / 4 + info.size * (i + 1)
          }">${el}</text>`
      )
      .reduce((a, b) => a + b)}
    </svg>`;

  return template;
};

export const svgToBlobURL = (svg: string) => {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  return url;
};

export const drawText = (
  scene: Scene,
  id: number,
  content: string,
  info: FontInfo,
  orientation: Orientation,
  opacity: number,
  program: WebGLProgram
) => {
  const imageURL = getCachedTexture(`${content}${info.name}${info.size}`)
    ? "no_url_needed"
    : svgToBlobURL(textToSvg(content, info));
  drawImage(
    scene,
    id,
    imageURL,
    orientation,
    opacity,
    program,
    false,
    `${content}${info.name}${info.size}`
  );
};
