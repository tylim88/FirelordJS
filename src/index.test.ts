import { getFirelord } from '.'
import { getFirestore } from 'firebase/firestore'
import { initializeApp, User } from './utilForTests'

initializeApp()

describe('test', () => {
	it('test no error', () => {
		expect(() =>
			getFirelord(getFirestore())<User>(`topLevel/FirelordTest/Users`)
		).not.toThrow()
	})
	it('test type', () => {
		;() => {
			// @ts-expect-error
			getFirelord(getFirestore())<User>(`topLevel/FirelordTest1/Users`)
			// @ts-expect-error
			const userRef = getFirelord(getFirestore())<User>('User1s')
			// @ts-expect-error
			userRef.doc(123)
			// @ts-expect-error
			userRef.collection(false)
			// @ts-expect-error
			userRef.collectionGroup({})
		}
	})
})
