import { describe, expect, it } from 'vitest'

import { fromThrowing } from '../src/index'

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

const recordingRun = <T>(returns: T): { readonly run: () => T; readonly calls: number[] } => {
  const calls: number[] = []
  return {
    run: () => {
      calls.push(calls.length + 1)
      return returns
    },
    calls,
  }
}

const throwing =
  (x: unknown): (() => number) =>
  () => {
    throw x
  }

describe('fromThrowing maps every throw to an err', () => {
  it("fromThrowing returns ok of run's own return value (rejects a fromThrowing that never calls run, or copies its return)", () => {
    const { toError } = recordingToError()
    const output = fromThrowing(() => value, toError)

    expect(output).toStrictEqual({ ok: true, value: { name: 'the value' } })
    expect(output.ok ? output.value : null).toBe(value)
  })

  it('fromThrowing calls run once and toError zero times when run returns (rejects a fromThrowing that calls run twice, or maps a return through toError)', () => {
    const { toError, calls: toErrorCalls } = recordingToError()
    const { run, calls: runCalls } = recordingRun(value)

    fromThrowing(run, toError)

    expect({ runCalls: runCalls.length, toErrorCalls: toErrorCalls.length }).toEqual({ runCalls: 1, toErrorCalls: 0 })
  })

  it("fromThrowing on a throw returns err of toError's output for the very value thrown (rejects a fromThrowing that lets the throw escape, wraps the raw caught value, or returns an ok)", () => {
    const { toError, calls } = recordingToError()
    const output = fromThrowing(throwing(thrown), toError)

    expect(output).toStrictEqual({ ok: false, error: { kind: 'read-failed' } })
    expect(output.ok ? null : output.error).toBe(error)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBe(thrown)
  })

  it('fromThrowing maps a thrown string through toError like any other thrown value (rejects a fromThrowing that maps only Error instances)', () => {
    const output = fromThrowing(throwing('boom'), caught => ({ kind: 'read-failed', thrown: caught }))

    expect(output).toStrictEqual({ ok: false, error: { kind: 'read-failed', thrown: 'boom' } })
  })

  it('fromThrowing returns a frozen result for a return and for a throw (rejects an unfrozen result)', () => {
    const { toError } = recordingToError()

    expect({
      returned: Object.isFrozen(fromThrowing(() => value, toError)),
      threw: Object.isFrozen(fromThrowing(throwing(thrown), toError)),
    }).toEqual({ returned: true, threw: true })
  })
})
