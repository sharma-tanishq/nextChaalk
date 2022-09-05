/** Maybe Monad */
export type Maybe<T> = T | null | undefined;
export const maybeRun = <T>(
  arg: Maybe<T>,
  func: (param: T, ...altParams: unknown[]) => T,
  ...altParams: unknown[]
) => {
  if (!arg) return undefined;
  return func(arg, ...altParams);
};

/** Get random hex of size */
export const getRandomHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
