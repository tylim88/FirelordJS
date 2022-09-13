import {
	doc as doc_,
	collection as collection_,
	getFirestore,
} from 'firebase/firestore'
import { refEqual } from './refEqual'
import { initializeApp, userRef, User } from '../utilForTests'
import { DocumentReference, CollectionReference } from '../types'
initializeApp()
const docRef = userRef.doc
const colRef = userRef.collection
describe('test refEqual', () => {
	it('test equal', () => {
		expect(
			refEqual(docRef('FirelordTest', 'abc'), docRef('FirelordTest', 'abc'))
		).toBe(true)
		expect(
			refEqual(
				docRef('FirelordTest', 'abc'),
				doc_(
					getFirestore(),
					'topLevel/FirelordTest/Users/abc'
				) as unknown as DocumentReference<User>
			)
		).toBe(true)
		expect(refEqual(colRef('FirelordTest'), colRef('FirelordTest'))).toBe(true)
		expect(
			refEqual(
				colRef('FirelordTest'),
				collection_(
					getFirestore(),
					colRef('FirelordTest').path
				) as unknown as CollectionReference<User>
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(
			refEqual(docRef('FirelordTest', 'abc'), docRef('FirelordTest', 'abcd'))
		).toBe(false)
		expect(
			refEqual(
				docRef('FirelordTest', 'abc'),
				doc_(
					getFirestore(),
					'topLevel/FirelordTest/Users/ab1'
				) as unknown as DocumentReference<User>
			)
		).toBe(false)
		expect(
			refEqual(
				colRef('FirelordTest'),
				collection_(
					getFirestore(),
					'a/b/c1'
				) as unknown as CollectionReference<User>
			)
		).toBe(false)
	})
})
