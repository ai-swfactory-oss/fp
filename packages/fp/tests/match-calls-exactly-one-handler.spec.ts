import { describe, expect, it } from 'vitest'

import { type Err, match, type Ok } from '../src/index'

const recordingHandlers = (): {
  readonly handlers: { readonly ok: (value: number) => string; readonly err: (error: string) => string }
  readonly okCalls: number[]
  readonly errCalls: string[]
} => {
  const okCalls: number[] = []
  const errCalls: string[] = []
  return {
    handlers: {
      ok: value => {
        okCalls.push(value)
        return 'was ok'
      },
      err: error => {
        errCalls.push(error)
        return 'was err'
      },
    },
    okCalls,
    errCalls,
  }
}

describe('match calls exactly one handler', () => {
  it('match on an ok calls only the ok handler, once, with the value, and returns its output (rejects a match that calls both handlers, passes the whole result, or takes the result first)', () => {
    const input: Ok<number> = { ok: true, value: 1 }
    const { handlers, okCalls, errCalls } = recordingHandlers()

    expect({ output: match(handlers)(input), okCalls, errCalls }).toEqual({ output: 'was ok', okCalls: [1], errCalls: [] })
  })

  it('match on an err calls only the err handler, once, with the error, and returns its output (rejects a match that calls both handlers, passes the whole result, or takes the result first)', () => {
    const input: Err<string> = { ok: false, error: 'e' }
    const { handlers, okCalls, errCalls } = recordingHandlers()

    expect({ output: match(handlers)(input), okCalls, errCalls }).toEqual({ output: 'was err', okCalls: [], errCalls: ['e'] })
  })
})
