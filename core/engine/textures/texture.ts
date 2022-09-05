import { cacheTexture, getCachedTexture } from "../../caches/texture";

export const getTexture = (
  gl: WebGLRenderingContext,
  url: string,
  cacheKey?: string,
  callback?: (arg: HTMLImageElement) => void
) => {
  const cachedTexture = getCachedTexture(cacheKey ? cacheKey : url);
  if (cachedTexture) return cachedTexture;

  const texture = gl.createTexture();
  if (!texture) return;

  gl.bindTexture(gl.TEXTURE_2D, texture);

  /**
   * Because images have to be downloaded over the internet
   * they might take a moment until they are ready.
   * Until then put a single pixel in the texture so we can
   * use it immediately. When the image has finished downloading
   * we'll update the texture with the contents of the image.
   */
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([22, 148, 154, 200]); /** Clear Blue */
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    if (callback) callback(image);

    image.remove();
  };
  image.src = url;
  console.log(image.src);

  cacheTexture(cacheKey ? cacheKey : url, texture);
  return texture;
};

const isPowerOf2 = (value: number) => (value & (value - 1)) === 0;
