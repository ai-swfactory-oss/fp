import { describe, expect, it } from 'vitest'

import { fromThrowingAsync } from '../src/index'

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

const rejecting =
  (x: unknown): (() => Promise<number>) =>
  async () => {
    await Promise.resolve()
    throw x
  }

const throwingBeforeAPromise =
  (x: unknown): (() => Promise<number>) =>
  () => {
    throw x
  }

describe('fromThrowingAsync resolves every rejection to an err', () => {
  it("fromThrowingAsync resolves to ok of the value run's promise resolves to (rejects a fromThrowingAsync that wraps the promise itself)", async () => {
    const { toError } = recordingToError()
    const output = await fromThrowingAsync(() => Promise.resolve(value), toError)

    expect(output).toStrictEqual({ ok: true, value: { name: 'the value' } })
    expect(output.ok ? output.value : null).toBe(value)
  })

  it("fromThrowingAsync resolves to err of toError's output when run's promise rejects (rejects a fromThrowingAsync whose promise rejects)", async () => {
    const { toError, calls } = recordingToError()
    const output = await fromThrowingAsync(rejecting(thrown), toError)

    expect(output).toStrictEqual({ ok: false, error: { kind: 'read-failed' } })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBe(thrown)
  })

  it('fromThrowingAsync resolves to err when run throws before returning a promise (rejects a fromThrowingAsync that calls run outside its catch)', async () => {
    const { toError } = recordingToError()
    const output = await fromThrowingAsync(throwingBeforeAPromise(thrown), toError)

    expect(output).toStrictEqual({ ok: false, error: { kind: 'read-failed' } })
  })

  it('fromThrowingAsync resolves to a frozen result for a resolution and for a rejection (rejects an unfrozen result)', async () => {
    const { toError } = recordingToError()
    const resolved = await fromThrowingAsync(() => Promise.resolve(value), toError)
    const rejected = await fromThrowingAsync(rejecting(thrown), toError)

    expect({ resolved: Object.isFrozen(resolved), rejected: Object.isFrozen(rejected) }).toEqual({ resolved: true, rejected: true })
  })
})
