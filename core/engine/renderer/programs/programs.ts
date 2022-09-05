import { getImageProgram, getNGonProgram } from "./utils";

/**
 * INTERFACES
 */
export interface Programs {
  imageProgram: WebGLProgram;
  selectedImageProgram: WebGLProgram;
  nGonProgram: WebGLProgram;
}

export type UniformSetter = (
  gl: WebGLRenderingContext,
  uniformLocation: WebGLUniformLocation
) => void;
export interface UniformBakingInfo {
  name: string;
  setter: UniformSetter;
}

export interface UniformInfo {
  location: WebGLUniformLocation;
  setter: UniformSetter;
}
export interface ProgramBakingInfo {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffers: {
    vertexBuffer: number[];
    textureMapping?: number[];
  };
  defaultBuffer?: WebGLBuffer;
  attribLocationNames: { vertexPosition: string; textureMapping?: string };
  uniformBakingInfoRecord: Record<string, UniformBakingInfo>;
}

export interface ProgramInfo {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  pointCount: number;
  buffers: { vertexBuffer: WebGLBuffer; textureMapping?: WebGLBuffer };
  attribLocations: { vertexPosition: number; textureMapping?: number };
  uniformInfoRecord: Record<string, UniformInfo>;
}

export type UniformSetters = Record<string, UniformSetter>;

/**
 * Utils
 */

export const setUniforms = (
  gl: WebGLRenderingContext,
  uniformInfoRecord: ProgramInfo["uniformInfoRecord"]
) => {
  Object.values(uniformInfoRecord).forEach((uniformInfo) => {
    uniformInfo.setter(gl, uniformInfo.location);
  });
};

export const getAllPrograms = (gl: WebGLRenderingContext) => {
  const imageProgram = getImageProgram(gl);
  const selectedImageProgram = getImageProgram(gl, true);
  const nGonProgram = getNGonProgram(gl);

  if (!imageProgram) return undefined;

  const programs = {
    imageProgram,
    selectedImageProgram,
    nGonProgram,
  } as Programs;

  return programs;
};
