import { isTransactionOptions } from './utils'

describe('test util', () => {
	it('test isTransactionOptions', () => {
		expect(isTransactionOptions({ maxAttempts: 6 })).toBe(true)
		expect(isTransactionOptions({ abc: 6 })).toBe(false)
		expect(isTransactionOptions(123)).toBe(false)
	})
})
