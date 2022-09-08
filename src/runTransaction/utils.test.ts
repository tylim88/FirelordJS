import { isTransactionOptions } from './utils'

describe('test util', () => {
	it('test isTransactionOptions', () => {
		expect(
			isTransactionOptions(() => {
				//
			})
		).toBe(false)
		expect(isTransactionOptions({ abc: 6 })).toBe(true)
		expect(isTransactionOptions(123)).toBe(true)
	})
})
