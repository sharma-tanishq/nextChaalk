export const createShader = (
  gl: WebGLRenderingContext,
  src: string,
  type: GLenum
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("Error creating Shader");
    return;
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  //Get Error data if shader failed compiling
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling shader : " + src,
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};