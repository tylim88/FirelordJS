import { getFirelord } from '.'
import { initializeApp, User } from './utilForTests'
import { getFirestore } from 'firebase/firestore'

initializeApp()

describe('test', () => {
	it('test no error', () => {
		expect(() =>
			getFirelord()<User>(`topLevel/FirelordTest/Users`)
		).not.toThrow()
	})
	it('test type', () => {
		;() => {
			getFirelord(getFirestore())<User>(
				// @ts-expect-error
				`topLevel/FirelordTest1/Users`
			)
			const userRef = getFirelord()<User>(
				// @ts-expect-error
				'User1s'
			)
			userRef.doc(
				// @ts-expect-error
				123
			)
			userRef.collection(
				// @ts-expect-error
				false
			)
			userRef.collectionGroup(
				// @ts-expect-error
				{}
			)
		}
	})
})
