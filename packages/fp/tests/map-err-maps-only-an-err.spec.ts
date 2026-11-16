import { describe, expect, it } from 'vitest'

import { type Err, mapErr, type Ok } from '../src/index'

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

describe('mapErr maps only an err', () => {
  it("mapErr applies f to an err's error and wraps its return in err (rejects a mapErr that returns f's raw output, maps the ok side, or is data-first)", () => {
    expect(mapErr(e => ({ kind: 'wrapped', inner: e }))({ ok: false, error: 'e' })).toStrictEqual({
      ok: false,
      error: { kind: 'wrapped', inner: 'e' },
    })
  })

  it('mapErr returns a frozen err (rejects an unfrozen result)', () => {
    const input: Err<string> = { ok: false, error: 'e' }
    const { f } = recording<string, string>('mapped')

    expect(Object.isFrozen(mapErr(f)(input))).toBe(true)
  })

  it('mapErr returns the same ok object and never calls f (rejects a copy of the ok, and a call of f on an ok)', () => {
    const input: Ok<number> = { ok: true, value: 1 }
    const { f, calls } = recording<string, string>('mapped')

    expect(mapErr(f)(input)).toBe(input)
    expect(calls).toEqual([])
  })
})
