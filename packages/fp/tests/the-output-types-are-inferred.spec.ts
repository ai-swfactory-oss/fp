import { describe, expectTypeOf, it } from 'vitest'

import { flatMap, map, match, type Ok, ok, pipe, type Result } from '../src/index'

interface Step<N extends number> {
  readonly step: N
}

const at = <N extends number>(step: N): Step<N> => ({ step })

const s1 = (): Step<1> => at(1)
const s2 = (): Step<2> => at(2)
const s3 = (): Step<3> => at(3)
const s4 = (): Step<4> => at(4)
const s5 = (): Step<5> => at(5)
const s6 = (): Step<6> => at(6)
const s7 = (): Step<7> => at(7)
const s8 = (): Step<8> => at(8)
const s9 = (): Step<9> => at(9)
const s10 = (): Step<10> => at(10)
const s11 = (): Step<11> => at(11)
const s12 = (): Step<12> => at(12)

type OneStep<A, B> = Parameters<typeof pipe<A, B>>

type Overloads<F> = F extends {
  (...args: infer A1): unknown
  (...args: infer A2): unknown
  (...args: infer A3): unknown
  (...args: infer A4): unknown
  (...args: infer A5): unknown
  (...args: infer A6): unknown
  (...args: infer A7): unknown
  (...args: infer A8): unknown
  (...args: infer A9): unknown
  (...args: infer A10): unknown
  (...args: infer A11): unknown
  (...args: infer A12): unknown
  (...args: infer A13): unknown
  (...args: infer A14): unknown
}
  ? A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 | A10 | A11 | A12 | A13 | A14
  : never

type Arities = Overloads<typeof pipe>['length']

const start = (): Result<number, 'e1'> => ({ ok: true, value: 1 })

const started = start()

describe('the output types are inferred', () => {
  it("map keeps the error type, flatMap unions the error types, and match returns the union of its handlers' returns (rejects a Result<unknown, unknown>)", () => {
    const toE2 = (n: number): Result<string, 'e2'> => (n > 0 ? { ok: true, value: 'positive' } : { ok: false, error: 'e2' })

    expectTypeOf(map((n: number) => String(n))(started)).toEqualTypeOf<Result<string, 'e1'>>()
    expectTypeOf(flatMap(toE2)(started)).toEqualTypeOf<Result<string, 'e1' | 'e2'>>()
    expectTypeOf(match({ ok: (n: number) => n, err: (e: 'e1') => [e] })(started)).toEqualTypeOf<number | 'e1'[]>()
  })

  it('pipe infers each step from the previous output and refuses a step whose input does not accept it (rejects a pipe typed with any)', () => {
    expectTypeOf(
      pipe(
        1,
        (n: number) => String(n),
        (s: string) => s.length > 0,
        (b: boolean) => [b],
        (bs: boolean[]) => ({ bs }),
      ),
    ).toEqualTypeOf<{ bs: boolean[] }>()
    expectTypeOf(
      pipe(
        ok(1),
        map(n => n + 1),
      ),
    )
      .extract<{ readonly ok: true }>()
      .toEqualTypeOf<Ok<number>>()
    expectTypeOf<[number, (n: number) => boolean] extends OneStep<number, boolean> ? true : false>().toEqualTypeOf<true>()
    expectTypeOf<[number, (s: string) => boolean] extends OneStep<number, boolean> ? true : false>().toEqualTypeOf<false>()
  })

  it('pipe infers the output of a twelve-step chain (rejects a pipe typed for fewer than twelve steps)', () => {
    expectTypeOf(pipe(at(0), s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12)).toEqualTypeOf<Step<12>>()
  })

  it('pipe refuses a thirteen-step chain at compile time (rejects a variadic pipe that admits any number of steps)', () => {
    expectTypeOf<13 extends Arities ? true : false>().toEqualTypeOf<true>()
    expectTypeOf<14 extends Arities ? true : false>().toEqualTypeOf<false>()
  })

  it('narrowing on ok gives value on an Ok and error on an Err, and neither key on the other (rejects a Result with both keys optional)', () => {
    const okSide = (result: Result<1, 2>) => (result.ok ? result : null)
    const errSide = (result: Result<1, 2>) => (result.ok ? null : result)

    expectTypeOf(okSide).returns.exclude<null>().toHaveProperty('value')
    expectTypeOf(okSide).returns.exclude<null>().not.toHaveProperty('error')
    expectTypeOf(errSide).returns.exclude<null>().toHaveProperty('error')
    expectTypeOf(errSide).returns.exclude<null>().not.toHaveProperty('value')
  })
})
