import { mat4 } from "gl-matrix";
import { RGBAColor } from "../../colors/interfaces";
import { Orientation } from "../../elements/interfaces";
import { Scene } from "../../scene/Scene";
import { getRectVertexBuffer } from "../../scene/utils";
import { setUniforms, UniformSetter } from "../programs/programs";
import { bakeProgramInfo } from "../programs/utils";

export const drawRectangle = (
  scene: Scene,
  orientation: Orientation,
  fillColor: RGBAColor,
  strokeColor: RGBAColor,
  strokeWidth: number,
  opacity: number,
  program: WebGLProgram,
  dashGap = 0
) => {
  if (!program) return;

  const { gl, view, defaultQuadBuffer } = scene;
  const buffers = {
    vertexBuffer: [0, 0, 0, 0, 0, 0, 0, 0],
  };

  const programBakingInfo = {
    gl,
    program,
    buffers,
    defaultBuffer: defaultQuadBuffer,
    attribLocationNames: {
      vertexPosition: "a_position",
    },
    uniformBakingInfoRecord: {
      fillColor: {
        name: "fillColor",
        setter: ((gl, loc) => {
          gl.uniform4fv(loc, fillColor);
        }) as UniformSetter,
      },
      dimensions: {
        name: "dimensions",
        setter: ((gl, loc) => {
          gl.uniform2fv(loc, orientation.dimensions);
        }) as UniformSetter,
      },
      strokeColor: {
        name: "strokeColor",
        setter: ((gl, loc) => {
          gl.uniform4fv(loc, strokeColor);
        }) as UniformSetter,
      },
      strokeWidth: {
        name: "strokeWidth",
        setter: ((gl, loc) => {
          gl.uniform1f(loc, strokeWidth);
        }) as UniformSetter,
      },
      dashGap: {
        name: "dashGap",
        setter: ((gl, loc) => {
          gl.uniform1f(loc, dashGap);
        }) as UniformSetter,
      },
      opacity: {
        name: "opacity",
        setter: ((gl, loc) => {
          gl.uniform1f(loc, opacity);
        }) as UniformSetter,
      },
      ModelMatrix: {
        name: "u_modelMatrix",
        setter: ((gl, loc) => {
          const [x, y] = [
            orientation.position[0] / gl.canvas.width,
            orientation.position[1] / gl.canvas.height,
          ];
          const [cw, ch] = [gl.canvas.width, gl.canvas.height];
          const [w, h] = [orientation.dimensions[0], orientation.dimensions[1]];

          const model = mat4.create();
          mat4.translate(model, model, [x + w / (2 * cw), y - h / (2 * ch), 0]);
          mat4.scale(model, model, [1 / cw, 1 / ch, 0]);
          mat4.rotateZ(model, model, orientation.rotation - Math.PI);
          mat4.scale(model, model, [-w, h, 0]);
          /** Scale */
          mat4.scale(model, model, [...orientation.scale, 1.0]);
          gl.uniformMatrix4fv(loc, false, model);
        }) as UniformSetter,
      },
      ViewMatrix: {
        name: "u_viewMatrix",
        setter: ((gl, loc) => {
          gl.uniformMatrix4fv(loc, false, view);
        }) as UniformSetter,
      },
      TextureMatrix: {
        name: "u_textureMatrix",
        setter: ((gl, loc) => {
          const model = mat4.create();
          mat4.translate(model, model, [0.5, 0.5, 0]);
          gl.uniformMatrix4fv(loc, false, model);
        }) as UniformSetter,
      },
    },
  };

  const programInfo = bakeProgramInfo(programBakingInfo);

  /**
   * Draw the texture if exists
   */
  {
    const { gl, buffers, program, attribLocations, uniformInfoRecord } =
      programInfo;

    gl.useProgram(program);

    /** Set Vertices */
    gl.enableVertexAttribArray(attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
    gl.vertexAttribPointer(
      attribLocations.vertexPosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    setUniforms(gl, uniformInfoRecord);

    /** Draw */
    const primitiveType = gl.TRIANGLE_STRIP;
    gl.drawArrays(primitiveType, 0, programInfo.pointCount);
  }
};
