import { mat4 } from "gl-matrix";
import { BoardElement } from "../elements/interfaces";
import { Maybe } from "../utils";
import { GLInstance, setBackgroundColor } from "./webglInit";
export interface Scene {
  domElement: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  defaultQuadBuffer: WebGLBuffer;
  view: mat4;
  pendingPointerState: {
    activated: boolean;
    released: boolean;
  };
  activeDrawElement: Maybe<BoardElement>;
  elements: BoardElement[];
  selected: BoardElement["id"][] /** basically number[] */;
  background: {
    color: string;
    opacity: number;
  };
  nextId: number;
}

export const getWebGLScene = (
  domElement: HTMLCanvasElement,
  elements: BoardElement[] = [],
  background: Scene["background"] = {
    color: "#ccc",
    opacity: 1.0,
  }
) => {
  /**
   * Recalculate Ids
   */
  elements.forEach((el, ind) => {
    el.id = ind + 1;
  });

  const nextId = elements.length ? elements.length : 1;
  const selected = [] as BoardElement["id"][];

  /**
   * GL
   */
  if (!domElement) {
    console.error("Canvas Not Found");
    return;
  }

  const gl = GLInstance(domElement, background.color);
  if (!gl) {
    throw new Error("Browser doesn't support webgl");
  }

  setBackgroundColor(gl, background.color, background.opacity);

  const defaultQuadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, defaultQuadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0 - 0.5,
      0 - 0.5,
      1 - 0.5,
      0 - 0.5,
      0 - 0.5,
      1 - 0.5,
      1 - 0.5,
      1 - 0.5,
    ]),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  if (!defaultQuadBuffer) console.log(`Couldn't Create default Quad buffer`);

  return {
    domElement,
    gl,
    defaultQuadBuffer,
    view: mat4.create(),
    pendingPointerState: {
      activated: false,
      released: false,
    },
    elements,
    selected,
    background,
    nextId,
  } as Scene;
};
