import { describe, expect, it } from 'vitest'

import { all, type Err, type Result } from '../src/index'

describe('all collects ok values or returns the first err', () => {
  it('all of ok results returns ok of their values in input order (rejects a reordered list, or a list of the results instead of their values)', () => {
    expect(
      all([
        { ok: true, value: 1 },
        { ok: true, value: 'two' },
        { ok: true, value: 3 },
      ]),
    ).toStrictEqual({ ok: true, value: [1, 'two', 3] })
  })

  it('all returns the first err object itself when several results are err (rejects the last err, a collected list of errors, or a copy of the err)', () => {
    const first: Err<string> = { ok: false, error: 'first' }
    const input: readonly Result<number, string>[] = [{ ok: true, value: 1 }, first, { ok: false, error: 'second' }]

    expect(all(input)).toBe(first)
  })

  it('all returns a frozen ok (rejects an unfrozen result)', () => {
    expect(Object.isFrozen(all([{ ok: true, value: 1 }]))).toBe(true)
  })

  it('all of an empty list returns ok of an empty list (rejects an err, or undefined, for no input)', () => {
    expect(all([])).toStrictEqual({ ok: true, value: [] })
  })
})
