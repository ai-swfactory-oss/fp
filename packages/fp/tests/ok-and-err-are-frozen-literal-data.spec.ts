import { describe, expect, it } from 'vitest'

import * as entry from '../src/index'

const { ok, err } = entry

const value = { name: 'the value' }

const error = { name: 'the error' }

describe('ok and err are frozen literal data', () => {
  it('ok and err return exactly the literal ok-and-value or ok-and-error object (rejects a class instance, an extra key, or a wrong ok flag)', () => {
    expect({ ok: ok(value), err: err(error) }).toStrictEqual({
      ok: { ok: true, value: { name: 'the value' } },
      err: { ok: false, error: { name: 'the error' } },
    })
  })

  it('ok and err return a frozen object (rejects an unfrozen result)', () => {
    expect({ ok: Object.isFrozen(ok(value)), err: Object.isFrozen(err(error)) }).toEqual({ ok: true, err: true })
  })

  it("ok and err wrap the caller's own reference (rejects a copy of the value or the error)", () => {
    expect(ok(value).value).toBe(value)
    expect(err(error).error).toBe(error)
  })

  it("ok and err leave the wrapped value unfrozen (rejects a deep freeze of the caller's data)", () => {
    ok(value)
    err(error)

    expect({ value: Object.isFrozen(value), error: Object.isFrozen(error) }).toEqual({ value: false, error: false })
  })

  it('ok and err return a fresh object on each call (rejects a shared singleton)', () => {
    expect(ok(value)).not.toBe(ok(value))
    expect(err(error)).not.toBe(err(error))
  })

  it("the package entry's exported names are exactly all, err, flatMap, fromPromise, fromThrowing, map, mapErr, match, ok and pipe (rejects an export that slips past the type pins)", () => {
    expect(Object.keys(entry).sort()).toEqual([
      'all',
      'err',
      'flatMap',
      'fromPromise',
      'fromThrowing',
      'map',
      'mapErr',
      'match',
      'ok',
      'pipe',
    ])
  })
})
