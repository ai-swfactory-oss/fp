import { describe, expectTypeOf, it } from 'vitest'

import { all, fromPromise, fromThrowing, mapErr, type Result } from '../src/index'

const error = { kind: 'read-failed' }

const toError = (_caught: unknown): typeof error => error

type FromThrowingTakes<T> = Parameters<typeof fromThrowing<T, typeof error>>

const one = (): Result<1, 'e1'> => ({ ok: true, value: 1 })

const two = (): Result<'two', 'e2'> => ({ ok: true, value: 'two' })

const three = (): Result<3, 'e3'> => ({ ok: true, value: 3 })

describe('the boundary types are inferred', () => {
  it("fromThrowing's ok type is run's return type and its error type is toError's return type (rejects a Result<unknown, unknown>)", () => {
    expectTypeOf(fromThrowing((): { name: string } => ({ name: 'the value' }), toError)).toEqualTypeOf<
      Result<{ name: string }, { kind: string }>
    >()
  })

  it("toError's parameter is unknown (rejects a toError typed Error, which a thrown string would violate)", () => {
    expectTypeOf<Parameters<Parameters<typeof fromThrowing>[1]>[0]>().toEqualTypeOf<unknown>()
    expectTypeOf<Parameters<Parameters<typeof fromPromise>[1]>[0]>().toEqualTypeOf<unknown>()
  })

  it('fromPromise returns a Promise of a Result of the resolved type (rejects a Result whose ok holds a promise)', () => {
    expectTypeOf(fromPromise(Promise.resolve(1), toError)).toEqualTypeOf<Promise<Result<number, { kind: string }>>>()
  })

  it('fromThrowing refuses a run that returns a promise (rejects a fromThrowing whose ok would hold an unmapped rejection)', () => {
    expectTypeOf<[() => Promise<number>, typeof toError] extends FromThrowingTakes<Promise<number>> ? true : false>().toEqualTypeOf<false>()
    expectTypeOf<[() => number, typeof toError] extends FromThrowingTakes<number> ? true : false>().toEqualTypeOf<true>()

    expectTypeOf(fromThrowing(() => 1, toError)).toExtend<Result<number, { kind: string }>>()
  })

  it('mapErr keeps the ok type and replaces the error type (rejects a mapErr that unions the old error type in)', () => {
    expectTypeOf(mapErr((e: 'e1') => ({ from: e }))(one())).toEqualTypeOf<Result<1, { from: 'e1' }>>()
  })

  it('all of a tuple infers the tuple of ok types and the union of error types (rejects an all typed with an array of unknown)', () => {
    expectTypeOf(all([one(), two(), three()])).toEqualTypeOf<Result<[1, 'two', 3], 'e1' | 'e2' | 'e3'>>()
  })
})
