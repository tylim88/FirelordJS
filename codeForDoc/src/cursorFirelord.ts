import { endAt } from 'firelordjs'

const arrNever: never[] = []
const arrNumber: number[] = []
const arr: [] = []
//
//
//
//
//
// @ts-expect-error
endAt()
// @ts-expect-error
endAt(...arr)
// @ts-expect-error
endAt(...arrNever)
// @ts-expect-error
endAt(...arrNumber)
