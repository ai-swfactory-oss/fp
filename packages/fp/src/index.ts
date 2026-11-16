export interface Ok<T> {
  readonly ok: true
  readonly value: T
}

export interface Err<E> {
  readonly ok: false
  readonly error: E
}

export type Result<T, E> = Ok<T> | Err<E>

export const ok = <T>(value: T): Ok<T> => {
  const built: Ok<T> = { ok: true, value }
  return Object.freeze(built)
}

export const err = <E>(error: E): Err<E> => {
  const built: Err<E> = { ok: false, error }
  return Object.freeze(built)
}

export const map =
  <T, U>(f: (value: T) => U) =>
  <E>(result: Result<T, E>): Result<U, E> =>
    result.ok ? ok(f(result.value)) : result

export const flatMap =
  <T, U, F>(f: (value: T) => Result<U, F>) =>
  <E>(result: Result<T, E>): Result<U, E | F> =>
    result.ok ? f(result.value) : result

export const match =
  <T, E, A, B>(handlers: { readonly ok: (value: T) => A; readonly err: (error: E) => B }) =>
  (result: Result<T, E>): A | B =>
    result.ok ? handlers.ok(result.value) : handlers.err(result.error)

export function pipe<A>(value: A): A
export function pipe<A, B>(value: A, s1: (a: A) => B): B
export function pipe<A, B, C>(value: A, s1: (a: A) => B, s2: (b: B) => C): C
export function pipe<A, B, C, D>(value: A, s1: (a: A) => B, s2: (b: B) => C, s3: (c: C) => D): D
export function pipe<A, B, C, D, E>(value: A, s1: (a: A) => B, s2: (b: B) => C, s3: (c: C) => D, s4: (d: D) => E): E
export function pipe<A, B, C, D, E, F>(value: A, s1: (a: A) => B, s2: (b: B) => C, s3: (c: C) => D, s4: (d: D) => E, s5: (e: E) => F): F
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
): G
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
  s7: (g: G) => H,
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
  s7: (g: G) => H,
  s8: (h: H) => I,
): I
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
  s7: (g: G) => H,
  s8: (h: H) => I,
  s9: (i: I) => J,
): J
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
  s7: (g: G) => H,
  s8: (h: H) => I,
  s9: (i: I) => J,
  s10: (j: J) => K,
): K
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
  s7: (g: G) => H,
  s8: (h: H) => I,
  s9: (i: I) => J,
  s10: (j: J) => K,
  s11: (k: K) => L,
): L
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  value: A,
  s1: (a: A) => B,
  s2: (b: B) => C,
  s3: (c: C) => D,
  s4: (d: D) => E,
  s5: (e: E) => F,
  s6: (f: F) => G,
  s7: (g: G) => H,
  s8: (h: H) => I,
  s9: (i: I) => J,
  s10: (j: J) => K,
  s11: (k: K) => L,
  s12: (l: L) => M,
): M
export function pipe(value: unknown, ...steps: readonly ((input: unknown) => unknown)[]): unknown {
  return steps.reduce((input, step) => step(input), value)
}
