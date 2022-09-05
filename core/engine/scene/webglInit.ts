import { hexToNormalizedRgb } from "../colors/utils";

/**
 * Get's GL instance and performs some Initialization tasks
 * @param canvas The Canvas Element tied to the Webgl Context
 * @returns A WebGL RenderingContext
 */
export const GLInstance = (canvas: HTMLCanvasElement, bgColor = "#ccc") => {
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) {
    console.error("WebGL context is not available.");
    return null;
  }

  canvas.width = canvas.clientWidth ;
  canvas.height = canvas.clientHeight ;

  setBackgroundColor(gl, bgColor);
  fSetSize(gl, canvas.width, canvas.height);

  return gl;
};

export const setBackgroundColor = (
  gl: WebGLRenderingContext,
  hex: string,
  alpha = 1.0
) => {
  const color = hexToNormalizedRgb(hex, alpha);

  if (!color) {
    console.error("Incorrect Hex and / or alpha Value Provided");
    return;
  }

  gl.clearColor(...color);
};

export const fclear = (gl: WebGLRenderingContext) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

export const fSetSize = function (
  gl: WebGLRenderingContext,
  w: number,
  h: number
) {
  gl.canvas.width = w;
  gl.canvas.height = h;
  gl.viewport(0, 0, w, h);
};
