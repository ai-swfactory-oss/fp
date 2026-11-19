import { describe, expectTypeOf, it } from 'vitest'

import type * as entry from '../src/index'

type AsyncCallback = (...args: never[]) => PromiseLike<unknown>

type TakesAsyncCallback<F> = F extends (...args: infer P) => unknown
  ? true extends { [K in keyof P]: P[K] extends AsyncCallback ? true : false }[number]
    ? true
    : false
  : false

type AsyncCallbackTakers<M> = { [K in keyof M]: TakesAsyncCallback<M[K]> extends true ? K : never }[keyof M]

interface Fixture {
  readonly settles: (run: () => Promise<number>) => Promise<number>
  readonly maps: (f: (x: number) => number) => number
  readonly holds: number
}

describe('no exported operation takes an async callback', () => {
  it('the check names an operation whose parameter is a callback returning a promise, and only that one (rejects a check that finds nothing)', () => {
    expectTypeOf<AsyncCallbackTakers<Fixture>>().toEqualTypeOf<'settles'>()
  })

  it("the package entry exports no operation whose parameters include a callback returning a promise-like (rejects fromThrowingAsync's run)", () => {
    expectTypeOf<AsyncCallbackTakers<typeof entry>>().toEqualTypeOf<never>()
  })
})
