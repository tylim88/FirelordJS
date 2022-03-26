import { limit } from './limit'

// limit to last type also tested in orderBy
describe('test limit type', () => {
	it('test wide number type, should pass', () => {
		;() => {
			const num = 1

			limit(num)
		}
	})
	it('test positive number type, should pass', () => {
		;() => {
			const num = 1 as const
			limit(num)
		}
	})
	it('test negative number type, should fail', () => {
		;() => {
			// @ts-expect-error
			limit(-1)
		}
	})
	it('test 0 literal type, should fail', () => {
		;() => {
			// @ts-expect-error
			limit(0)
		}
	})
	it('test decimal literal type, should fail', () => {
		;() => {
			// @ts-expect-error
			limit(0.111)
		}
	})
	it('test negative decimal literal type, should fail', () => {
		;() => {
			// @ts-expect-error
			limit(-9.875)
		}
	})
})
