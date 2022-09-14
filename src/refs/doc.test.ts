import { initializeApp, userRefCreator } from '../utilForTests'

initializeApp()

const userRef = userRefCreator()

describe('simple collection type test', () => {
	it('test invalid doc ID, negative test', () => {
		expect(() =>
			userRef.doc(
				'FirelordTest',
				// @ts-expect-error
				'a/b'
			)
		).toThrow()

		userRef.doc(
			'FirelordTest',
			// @ts-expect-error
			'.'
		)

		userRef.doc(
			'FirelordTest',
			// @ts-expect-error
			'a..b'
		)
	})
})
