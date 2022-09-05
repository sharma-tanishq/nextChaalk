/** Maybe Monad */
export type Maybe<T> = T | undefined;
export const unsafeChain = <A>(
  arg: A,
  ...funcs: ((arg: A) => Maybe<A>)[]
): Maybe<A> => {
  let x = arg as Maybe<A>;

  for (let i = 0; i < funcs.length; i++) {
    if (x === undefined) break;
    const y = funcs[i](x);
    x = y;
  }

  return x;
};
