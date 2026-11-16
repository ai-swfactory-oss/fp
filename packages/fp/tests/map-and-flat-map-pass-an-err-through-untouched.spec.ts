import { describe, expect, it } from 'vitest'

import { type Err, flatMap, map, type Ok, ok, pipe } from '../src/index'

const recording = <T, R>(returns: R): { readonly f: (input: T) => R; readonly calls: T[] } => {
  const calls: T[] = []
  return {
    f: input => {
      calls.push(input)
      return returns
    },
    calls,
  }
}

describe('map and flatMap pass an err through untouched', () => {
  it("map applies f to an ok value and wraps its return in ok (rejects a map that returns f's raw output, and a data-first map)", () => {
    expect(
      pipe(
        ok(1),
        map(n => n + 1),
      ),
    ).toStrictEqual({ ok: true, value: 2 })
  })

  it("flatMap applies f to an ok value and returns f's result as it is (rejects a flatMap that wraps f's result again, and a data-first flatMap)", () => {
    const two: Ok<string> = { ok: true, value: 'two' }
    const { f } = recording<number, Ok<string>>(two)

    expect(flatMap(f)({ ok: true, value: 2 })).toBe(two)
  })

  it('map returns the same err object and never calls f (rejects a copy of the err, and a call of f on an err)', () => {
    const input: Err<string> = { ok: false, error: 'e' }
    const { f, calls } = recording<number, number>(0)

    expect(map(f)(input)).toBe(input)
    expect(calls).toEqual([])
  })

  it('flatMap returns the same err object and never calls f (rejects a copy of the err, and a call of f on an err)', () => {
    const input: Err<string> = { ok: false, error: 'e' }
    const { f, calls } = recording<number, Ok<number>>({ ok: true, value: 0 })

    expect(flatMap(f)(input)).toBe(input)
    expect(calls).toEqual([])
  })
})
