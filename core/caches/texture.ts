export interface TextureCacheInfo {
  texture: WebGLTexture;
  lastUsed: number;
}

const textureCache = {} as Record<string, TextureCacheInfo>;

export const cacheTexture = (source: string, texture: WebGLTexture) => {
  textureCache[source] = {
    texture,
    lastUsed: Date.now(),
  };
};

export const getCachedTexture = (source: string) => {
  if (!textureCache[source]) return undefined;

  textureCache[source].lastUsed = Date.now();
  return textureCache[source].texture;
};

export const pruneTextureCache = (gl: WebGLRenderingContext, limit: number) => {
  Object.keys(textureCache).forEach((key) => {
    if (textureCache[key].lastUsed < limit) {
      gl.deleteTexture(textureCache[key].texture);
      delete textureCache[key];
    }
  });
};