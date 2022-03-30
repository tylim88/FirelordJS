import { limit } from 'firelordjs'

//
//
//
//
// @ts-expect-error
limit(-9.64) // block negative decimal
// @ts-expect-error
limit(-6) // block negative integer
// @ts-expect-error
limit(0) // block 0
// @ts-expect-error
limit(1.2) // block decimal

limit(45) // ok, positive number
limit(-1 as number) // ok, number type
