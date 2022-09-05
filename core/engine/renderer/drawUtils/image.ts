import { mat4 } from "gl-matrix";
import { Orientation } from "../../elements/interfaces";
import { Scene } from "../../scene/Scene";
import { modifyElements } from "../../scene/utils";
import { getTexture } from "../../textures/texture";
import { getVideoTexture } from "../../textures/video";
import { setUniforms, UniformSetter } from "../programs/programs";
import { bakeProgramInfo } from "../programs/utils";

export const drawImage = (
  scene: Scene,
  id: number,
  src: string,
  orientation: Orientation,
  opacity: number,
  program: WebGLProgram,
  video = false,
  cacheKey?: string
) => {
  if (!program) return;
  const { gl, view, defaultQuadBuffer } = scene;
  const buffers = {
    vertexBuffer: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      Sampler: {
        name: "sampler2D",
        setter: ((gl, loc) => {
          gl.uniform1i(loc, 1);
        }) as UniformSetter,
      },
      resolution: {
        name: "iResolution",
        setter: ((gl, loc) => {
          gl.uniform2fv(loc, [gl.canvas.width, gl.canvas.height]);
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

  const imageDimensionCorrection =
    id >= 0
      ? (img: HTMLImageElement) => {
          modifyElements(scene, [id], (el) => {
            el.orientation.dimensions = [img.naturalWidth, img.naturalHeight];
            el.isInitialized = true;
          });
        }
      : () => {};

  const videoDimensionCorrection =
    id >= 0
      ? (vid: HTMLVideoElement) => {
          modifyElements(scene, [id], (el) => {
            el.orientation.dimensions = [vid.videoWidth, vid.videoHeight];
            el.isInitialized = true;
          });
        }
      : () => {};

  const texture = video
    ? getVideoTexture(gl, src, cacheKey, videoDimensionCorrection)
    : getTexture(gl, src, cacheKey, imageDimensionCorrection);
  const programInfo = bakeProgramInfo(programBakingInfo);

  /**
   * Draw the texture if exists
   */
  if (texture) {
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

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    setUniforms(gl, uniformInfoRecord);

    /** Set Texture Mapping */
    if (attribLocations.textureMapping && buffers.textureMapping) {
      gl.enableVertexAttribArray(attribLocations.textureMapping);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureMapping);
      gl.vertexAttribPointer(
        attribLocations.textureMapping,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    /** Draw */
    const primitiveType = gl.TRIANGLE_STRIP;
    gl.drawArrays(primitiveType, 0, programInfo.pointCount);
  } else {
    console.log("no texture");
  }
};
