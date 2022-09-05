import {
  cacheVideo,
  getCachedVideoTexture,
  videoReady,
} from "../../caches/video";
import { RGBAColor } from "../colors/interfaces";

export const setupVideo = (
  url: string,
  callback = (arg: HTMLVideoElement) => {}
) => {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";

  let playing = false;
  let timeupdate = false;

  video.autoplay = true;
  video.muted = true;
  video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener(
    "playing",
    function () {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    function () {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate && !videoReady(url)) callback(video);
  }

  return video;
};

export const initColorTexture = (
  gl: WebGLRenderingContext,
  color: RGBAColor = [22, 148, 154, 200]
) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array(color);
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

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
};

export const updateVideoTexture = (
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  video: HTMLVideoElement
) => {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
};

export const getVideoTexture = (
  gl: WebGLRenderingContext,
  url: string,
  cacheKey?: string,
  callback?: (arg: HTMLVideoElement) => void
) => {
  const cachedVideo = getCachedVideoTexture(cacheKey ? cacheKey : url);

  if (cachedVideo) return cachedVideo;

  const texture = initColorTexture(gl);
  if (!texture) {
    console.log("color texture couldn't be made");
    return;
  }

  const domElement = setupVideo(url, callback);

  cacheVideo(cacheKey ? cacheKey : url, texture, domElement);
  return texture;
};
