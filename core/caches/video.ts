export interface VideoCacheInfo {
  texture: WebGLTexture;
  domElement: HTMLVideoElement;
  isReady: boolean;
  lastUsed: number;
}

const videoCache = {} as Record<string, VideoCacheInfo>;

export const cacheVideo = (
  source: string,
  texture: WebGLTexture,
  domElement: HTMLVideoElement
) => {
  videoCache[source] = {
    texture,
    isReady: false,
    domElement,
    lastUsed: Date.now(),
  };
};

export const videoReady = (source: string) => {
  if (!videoCache[source]) return undefined;
  videoCache[source].lastUsed = Date.now();
  const prevReady = videoCache[source].isReady;
  videoCache[source].isReady = true;
  return prevReady;
};

export const getCachedVideoTexture = (source: string) => {
  if (!videoCache[source]) return undefined;

  videoCache[source].lastUsed = Date.now();
  return videoCache[source].texture;
};

export const getCachedVideoDomElement = (source: string) => {
  if (!videoCache[source]) return undefined;
  if (!videoCache[source].isReady) return false;

  videoCache[source].lastUsed = Date.now();
  return videoCache[source].domElement;
};

export const deleteVideoFromCache = (
  gl: WebGLRenderingContext,
  key: string
) => {
  gl.deleteTexture(videoCache[key].texture);
  videoCache[key].domElement.remove();
  delete videoCache[key];
};

export const pruneVideoCache = (gl: WebGLRenderingContext, limit: number) => {
  Object.keys(videoCache).forEach((key) => {
    if (videoCache[key].lastUsed < limit) {
      gl.deleteTexture(videoCache[key].texture);
      videoCache[key].domElement.remove();
      delete videoCache[key];
    }
  });
};
