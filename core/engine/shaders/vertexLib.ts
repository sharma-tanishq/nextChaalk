export const imageVertexSrc = `
attribute vec2 a_position;

varying vec2 v_texcoord;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_textureMatrix;

void main() {
  vec4 a4_position = vec4(a_position, 0.0, 1.0);
  gl_Position = u_viewMatrix * u_modelMatrix * a4_position;
  v_texcoord = (u_textureMatrix * a4_position).xy;
}
`;
