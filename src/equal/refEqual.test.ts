import {
	doc as doc_,
	collection as collection_,
	getFirestore,
} from 'firebase/firestore'
import { doc, collection } from '../refs'
import { refEqual } from './refEqual'
import { initializeApp, userRefCreator } from '../utilForTests'

initializeApp()
const docRef = userRefCreator().doc('abc')
describe('test refEqual', () => {
	it('test equal', () => {
		expect(refEqual(doc('a/b', getFirestore()), doc('a/b'))).toBe(true)
		expect(refEqual(doc('a/b'), doc_(getFirestore(), 'a/b'))).toBe(true)
		expect(
			refEqual(collection('a/b/c', getFirestore()), collection('a/b/c'))
		).toBe(true)
		expect(
			refEqual(collection('a/b/c'), collection_(getFirestore(), 'a/b/c'))
		).toBe(true)
	})
	it('test not equal', () => {
		expect(refEqual(docRef, doc('a/b'))).toBe(false)
		expect(refEqual(doc('a/b'), doc_(getFirestore(), 'a/b1'))).toBe(false)
		expect(
			refEqual(collection('a/b/c1', getFirestore()), collection('a/b/c'))
		).toBe(false)
		expect(
			refEqual(collection('a/b/c'), collection_(getFirestore(), 'a/b/c1'))
		).toBe(false)
	})
})
