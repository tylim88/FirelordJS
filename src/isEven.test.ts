import { it, expect } from 'vitest'
import { isEven } from './isEven'

it('test isEven', () => {
	expect(isEven(2)).toBe(true)
	expect(isEven(1)).toBe(false)
})
