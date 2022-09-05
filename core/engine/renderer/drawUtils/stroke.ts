import { getCachedTexture } from "../../../caches/texture";
import { RGBAColor } from "../../colors/interfaces";
import { rgbaToHex } from "../../colors/utils";
import { FontInfo, Orientation, Stroke } from "../../elements/interfaces";
import { Scene } from "../../scene/Scene";
import { drawImage } from "./image";

export interface StrokeInfo {
  points: [number, number][];
  fill: {
    color: string;
    opacity: number;
  };
  stroke: {
    color: string;
    opacity: number;
    width: number;
  };
}

export const getStrokeInfo = (elem: Stroke) => {
  return {
    points: elem.points,
    fill: {
      color: rgbaToHex(elem.fillColor),
      opacity: elem.fillColor[3],
    },
    stroke: {
      color: rgbaToHex(elem.strokeColor),
      opacity: elem.strokeColor[3],
      width: elem.strokeWidth,
    },
  };
};

const med = (A: [number, number], B: [number, number]): [number, number] => [
  (A[0] + B[0]) / 2,
  (A[1] + B[1]) / 2,
];

const getSvgPathFromStroke = (points: [number, number][]) => {
  const l = points.length;
  if (l < 3) return "";

  const f = Math.floor;
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;

  for (let i = 0; i < l - 1; i++) {
    d += ` Q ${f(points[i][0])} ${f(points[i][1])}`;
    const mean = med(points[i], points[i + 1]);
    d += ` ${f(mean[0])} ${f(mean[1])}`;
  }

  d += ` T ${f(points[l - 1][0])} ${f(points[l - 1][1])}`;
  return d;
};

export const pointsToSvg = (info: StrokeInfo) => {
  if (info.points.length < 3) return null;
  const start = info.points[0];

  const maxPoints = info.points.reduce((a, b) => [
    a[0] > b[0] ? a[0] : b[0],
    a[1] > b[1] ? a[1] : b[1],
  ]);
  const minPoints = info.points.reduce((a, b) => [
    a[0] < b[0] ? a[0] : b[0],
    a[1] < b[1] ? a[1] : b[1],
  ]);

  const width = maxPoints[0] - minPoints[0];
  const height = maxPoints[1] - minPoints[1];

  const points = info.points.map((el) => [
    el[0] - minPoints[0] + info.stroke.width,
    height - el[1] + minPoints[1] + info.stroke.width,
  ]) as [number, number][];

  const template = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${width + 2 * info.stroke.width}"
    height="${height + 2 * info.stroke.width}"
    viewBox="0 0 ${width + 2 * info.stroke.width} ${
    height + 2 * info.stroke.width
  }">
    <style>
    .overall {
      fill: ${info.stroke.color};
      stroke-width: 5;
    }
    </style>
   <path d="${getSvgPathFromStroke(points)}" stroke-width="${
    info.stroke.width
  }" stroke="black" stroke-linecap="round" fill="transparent"/>
    </svg>`;

  return template;
};

export const svgToBlobURL = (svg: string) => {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  return url;
};

export const drawStroke = (
  scene: Scene,
  id: number,
  info: StrokeInfo,
  orientation: Orientation,
  opacity: number,
  program: WebGLProgram
) => {
  const cachekey = `${info.points}${Object.values(info.stroke)}${Object.values(
    info.fill
  )}`;
  const svg = pointsToSvg(info);
  if (!svg) return;
  const imageURL = getCachedTexture(cachekey)
    ? "no_url_needed"
    : svgToBlobURL(svg);
  drawImage(
    scene,
    id,
    imageURL,
    orientation,
    opacity,
    program,
    false,
    cachekey
  );
};
