const imageShaderHeaders = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D texture;
uniform float opacity;
uniform vec2 iResolution;
`;

export const imageFragSrc = `
${imageShaderHeaders}

void main() {
  
  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    discard;
  }

  vec4 texColor = texture2D(texture, v_texcoord);
  gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
}
`;

const nGonShaderHeaders = `
precision mediump float;

varying vec2 v_texcoord;
uniform float opacity;
uniform float strokeWidth;
uniform float dashGap;
uniform vec4 strokeColor;
uniform vec4 fillColor;
uniform vec2 dimensions;
`;

export const nGonFragSrc = `
${nGonShaderHeaders}

void main() {
  
  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    discard;
  }

  float dashFrequency = 2.0;
  float strokeSizeX = strokeWidth / abs(dimensions.x);
  strokeSizeX *= step(dashGap*2.0-1.0, sin(dashFrequency * v_texcoord.y * dimensions.y / 12.0));
  float strokeSizeY = strokeWidth / abs(dimensions.y);
  strokeSizeY *= step(dashGap*2.0-1.0, sin(dashFrequency * v_texcoord.x * dimensions.x / 12.0));
  float mixAmount = step(strokeSizeX, v_texcoord.x);

  mixAmount *= step(v_texcoord.x, (1.0 - strokeSizeX));
  mixAmount *= step(v_texcoord.y, (1.0 - strokeSizeY));
  mixAmount *= step(strokeSizeY, v_texcoord.y);

  vec4 fill = vec4(fillColor.rgb, fillColor.a * opacity);
  vec4 stroke = vec4(strokeColor.rgb, strokeColor.a * opacity);

  gl_FragColor = mix(stroke, fill, mixAmount);
}
`;

export const selectedImageFragSrc = `
${imageShaderHeaders}

void main() {
  
  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    discard;
  }
  
  float borderSize = 0.01;
  float stripSize = 0.02;
  float dashLengthInverse = 180.0;
  float gapInverse = 0.5;

  if (
    2.0 * abs(0.5 - v_texcoord.x) > 1.0 - borderSize &&
    sin(dashLengthInverse * v_texcoord.y) < gapInverse ||
    2.0 * abs(0.5 - v_texcoord.y) > 1.0 - borderSize &&
    sin(dashLengthInverse * v_texcoord.x) < gapInverse 
    ) {
    gl_FragColor = vec4(0.4, 0.4, 0.4, 1.0);
  }
  else if (
    (2.0 * abs(0.5 - v_texcoord.x) > 1.0 - stripSize) ||
    (2.0 * abs(0.5 - v_texcoord.y) > 1.0 - stripSize)
    ) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
  else {
    vec4 texColor = texture2D(texture, v_texcoord);
    gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
  }
}
`;

export const strokeFragSrc = `

`;
