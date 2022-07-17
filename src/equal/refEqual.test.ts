import {
	doc as doc_,
	collection as collection_,
	getFirestore,
} from 'firebase/firestore'
import { refEqual } from './refEqual'
import { initializeApp, userRefCreator, User } from '../utilForTests'
import { DocumentReference, CollectionReference } from '../types'
initializeApp()
const docRef = userRefCreator().doc
const colRef = userRefCreator().collection
describe('test refEqual', () => {
	it('test equal', () => {
		expect(refEqual(docRef(getFirestore(), 'abc'), docRef('abc'))).toBe(true)
		expect(
			refEqual(
				docRef('abc'),
				doc_(
					getFirestore(),
					'topLevel/FirelordTest/Users/abc'
				) as unknown as DocumentReference<User>
			)
		).toBe(true)
		expect(refEqual(colRef(getFirestore()), colRef())).toBe(true)
		expect(
			refEqual(
				colRef(),
				collection_(
					getFirestore(),
					colRef().path
				) as unknown as CollectionReference<User>
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(refEqual(docRef('abc'), docRef('abcd'))).toBe(false)
		expect(
			refEqual(
				docRef(getFirestore(), 'abc'),
				doc_(
					getFirestore(),
					'topLevel/FirelordTest/Users/ab1'
				) as unknown as DocumentReference<User>
			)
		).toBe(false)
		expect(
			refEqual(
				colRef(),
				collection_(
					getFirestore(),
					'a/b/c1'
				) as unknown as CollectionReference<User>
			)
		).toBe(false)
	})
})
