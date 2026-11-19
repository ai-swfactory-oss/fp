import { describe, expect, it } from 'vitest'

import { fromPromise } from '../src/index'

const value = { name: 'the value' }

const thrown = { name: 'the thrown' }

const error = { kind: 'read-failed' }

const recordingToError = (): { readonly toError: (caught: unknown) => typeof error; readonly calls: unknown[] } => {
  const calls: unknown[] = []
  return {
    toError: caught => {
      calls.push(caught)
      return error
    },
    calls,
  }
}

const rejectingWith = async (reason: unknown): Promise<number> => {
  await Promise.resolve()
  throw reason
}

describe('a settled promise becomes a result', () => {
  it('a fulfilled promise gives a frozen ok of its value (rejects a result that wraps the promise itself)', async () => {
    const { toError, calls } = recordingToError()
    const output = await fromPromise(Promise.resolve(value), toError)

    expect(output).toStrictEqual({ ok: true, value: { name: 'the value' } })
    expect(output.ok ? output.value : null).toBe(value)
    expect(Object.isFrozen(output)).toBe(true)
    expect(calls).toEqual([])
  })

  it("a rejected promise gives a frozen err of toError's output for the rejection reason (rejects a rejection that escapes)", async () => {
    const { toError, calls } = recordingToError()
    const output = await fromPromise(rejectingWith(thrown), toError)

    expect(output).toStrictEqual({ ok: false, error: { kind: 'read-failed' } })
    expect(Object.isFrozen(output)).toBe(true)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBe(thrown)
  })
})
