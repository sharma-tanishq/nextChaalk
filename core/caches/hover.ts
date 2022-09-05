let hoverCache = [] as number[];

export const cacheHovers = (hoverObjs: number[]) => {
  hoverCache = hoverObjs;
};

export const getCachedHovers = (source: string) => (hoverCache);