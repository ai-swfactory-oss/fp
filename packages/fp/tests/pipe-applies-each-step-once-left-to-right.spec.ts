import { describe, expect, it } from 'vitest'

import { pipe } from '../src/index'

describe('pipe applies each step once, left to right', () => {
  it('pipe with no step returns its value (rejects a pipe that returns undefined or wraps the value)', () => {
    expect(pipe(1)).toBe(1)
  })

  it('pipe applies each step once, left to right (rejects a pipe that composes right to left, or calls a step twice)', () => {
    const recorded: string[] = []
    const appending =
      (letter: string) =>
      (input: string): string => {
        recorded.push(letter)
        return `${input}${letter}`
      }

    expect({ output: pipe('', appending('a'), appending('b'), appending('c')), recorded }).toEqual({
      output: 'abc',
      recorded: ['a', 'b', 'c'],
    })
  })
})
