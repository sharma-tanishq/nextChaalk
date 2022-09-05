import {
  imageFragSrc,
  nGonFragSrc,
  selectedImageFragSrc,
} from "../../shaders/fragLib";
import { createShader } from "../../shaders/shader";
import { imageVertexSrc } from "../../shaders/vertexLib";
import { ProgramBakingInfo, ProgramInfo } from "./programs";

export const createProgram = (
  gl: WebGLRenderingContext,
  vShader: WebGLShader,
  fShader: WebGLShader,
  doValidate: boolean
) => {
  //Link shaders together
  const prog = gl.createProgram();

  if (!prog) {
    console.error("Error Creating Program");
    return;
  }

  gl.attachShader(prog, vShader);
  gl.attachShader(prog, fShader);
  gl.linkProgram(prog);

  //Check if successful
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }

  //Only do this for additional debugging.
  if (doValidate) {
    gl.validateProgram(prog);
    if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
      console.error("Error validating program", gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
  }

  //Can delete the shaders since the program has been made.
  gl.detachShader(prog, vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
  gl.detachShader(prog, fShader);
  gl.deleteShader(fShader);
  gl.deleteShader(vShader);

  return prog;
};

export const getImageProgram = (
  gl: WebGLRenderingContext,
  selected = false
) => {
  const vShader = createShader(gl, imageVertexSrc, gl.VERTEX_SHADER);
  const fShader = createShader(
    gl,
    selected ? selectedImageFragSrc : imageFragSrc,
    gl.FRAGMENT_SHADER
  );

  if (!vShader || !fShader) {
    console.error("Couldn't Compile Shaders");
    return undefined;
  }

  const program = createProgram(gl, vShader, fShader, true);
  if (!program) {
    console.error("Couldn't create Image Program");
    return undefined;
  }

  return program;
};

export const getNGonProgram = (gl: WebGLRenderingContext) => {
  const vShader = createShader(gl, imageVertexSrc, gl.VERTEX_SHADER);
  const fShader = createShader(gl, nGonFragSrc, gl.FRAGMENT_SHADER);

  if (!vShader || !fShader) {
    console.error("Couldn't Compile Shaders");
    return undefined;
  }

  const program = createProgram(gl, vShader, fShader, true);
  if (!program) {
    console.error("Couldn't create Image Program");
    return undefined;
  }

  return program;
};

/**
 * UTILS
 */

export const initBuffers = (
  gl: WebGLRenderingContext,
  bufferData: Record<string, number[]>,
  defaultBuffer?: WebGLBuffer
) => {
  const buffers = {} as Record<string, WebGLBuffer>;

  /** Prepare Buffers */
  Object.keys(bufferData).forEach((key) => {
    if (defaultBuffer) {
      buffers[key] = defaultBuffer;
      return;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        bufferData[key].map((el, i /** Convert Canvas Space to Clip Space */) =>
          i % 2 === 0 ? el / gl.canvas.clientWidth : el / gl.canvas.clientHeight
        )
      ),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    if (buffer) buffers[key] = buffer;
    else console.log(`Couldn't Create ${key} buffer`);
  });

  return buffers;
};

export const bakeUniforms = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  uniformBakingInfoRecord: ProgramBakingInfo["uniformBakingInfoRecord"]
) => {
  const bakedUniforms = {} as ProgramInfo["uniformInfoRecord"];

  Object.keys(uniformBakingInfoRecord).forEach((key) => {
    const location = gl.getUniformLocation(
      program,
      uniformBakingInfoRecord[key].name
    );
    if (location)
      bakedUniforms[key] = {
        location,
        setter: uniformBakingInfoRecord[key].setter,
      };
  });

  return bakedUniforms;
};

export const getAttributeLocations = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  attributeNames: Record<string, string>
) => {
  const attributeLocations = {} as Record<string, number>;

  Object.keys(attributeNames).forEach((key) => {
    const attributeLocation = gl.getAttribLocation(
      program,
      attributeNames[key]
    );
    if (attributeLocation) attributeLocations[key] = attributeLocation;
  });

  return attributeLocations;
};

export const bakeProgramInfo = (programBakingInfo: ProgramBakingInfo) => {
  const {
    gl,
    program,
    buffers,
    attribLocationNames,
    uniformBakingInfoRecord,
    defaultBuffer,
  } = programBakingInfo;

  return {
    gl,
    program,
    pointCount: buffers.vertexBuffer.length / 2,
    buffers: initBuffers(gl, buffers, defaultBuffer),
    attribLocations: getAttributeLocations(gl, program, attribLocationNames),
    uniformInfoRecord: bakeUniforms(gl, program, uniformBakingInfoRecord),
  } as ProgramInfo;
};
