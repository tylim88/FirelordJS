import { initializeApp, grandChildRefCreator } from '../utilForTests'

initializeApp()

const grandChildRef = grandChildRefCreator()

describe('simple collection type test', () => {
	it('test invalid doc ID, negative test', () => {
		grandChildRef.collection('FirelordTest', 'ab')

		grandChildRef.collection('FirelordTest', 'a.b')

		grandChildRef.collection('FirelordTest', '_a._.b_')
	})

	it('test invalid doc ID, negative test', () => {
		expect(() =>
			grandChildRef.collection(
				'FirelordTest',
				// @ts-expect-error
				'a/b'
			)
		).toThrow()

		grandChildRef.collection(
			'FirelordTest',
			// @ts-expect-error
			'.'
		)

		grandChildRef.collection(
			'FirelordTest',
			// @ts-expect-error
			'a..b'
		)

		grandChildRef.collection(
			'FirelordTest',
			// @ts-expect-error
			'__ab__'
		)
	})
})
