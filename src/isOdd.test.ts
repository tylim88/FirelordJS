import { expect, it } from 'vitest'
import { isOdd } from './isOdd'

it('test isOdd', () => {
	expect(isOdd(2)).toBe(false)
	expect(isOdd(1)).toBe(true)
})
