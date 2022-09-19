import {
	initializeApp,
	grandChildRefCreator,
	userRefCreator,
	User,
} from '../utilForTests'
import { refEqual } from '../equal'
import { IsSame, IsTrue, DocumentReference } from '../types'

initializeApp()

const grandChildRef = grandChildRefCreator()

describe('simple collection type test', () => {
	it('test invalid doc ID, positive test', () => {
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

	it('test props value and type', () => {
		const id = 'abc'
		const ref = grandChildRef.collection('FirelordTest', id)
		const parentRef = userRefCreator().doc('FirelordTest', id)
		expect(ref.id).toBe('GrandChild')
		expect(ref.path).toBe(`topLevel/FirelordTest/Users/${id}/GrandChild`)

		expect(refEqual(ref.parent, parentRef)).toBe(true)
		expect(ref.type).toBe('collection')

		IsTrue<IsSame<typeof ref.id, 'GrandChild'>>()
		IsTrue<
			IsSame<
				typeof ref.path,
				| `topLevel/FirelordTest/Users/${string}/GrandChild`
				| `topLevel/ForCursorTest/Users/${string}/GrandChild`
			>
		>()
		IsTrue<IsSame<typeof ref.parent, DocumentReference<User>>>()
		IsTrue<IsSame<typeof ref.type, 'collection'>>()
	})
})
