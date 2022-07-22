import { handleEmptyArray } from './utils'

describe('test handleEmptyArray', () => {
	it('test empty data', () => {
		expect(handleEmptyArray([]).length).toBe(1)
	})
	it('test empty data', () => {
		const arr = [1, 2, 3]
		expect(handleEmptyArray(arr)).toBe(arr)
	})
})
