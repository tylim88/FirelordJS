import { query as query_, getFirestore } from 'firebase/firestore'
import { query, collection, collectionGroup } from '../refs'
import { queryEqual } from './queryEqual'
import { initializeApp, userRefCreator } from '../utilForTests'
import { where, orderBy } from '../queryClauses'

initializeApp()
const colRef = userRefCreator().collection()
describe('test queryEqual', () => {
	it('test equal', () => {
		expect(
			queryEqual(
				query(collection('a/b/c'), where('a', '==', 1)),
				query(collection('a/b/c'), where('a', '==', 1))
			)
		).toBe(true)
		expect(
			queryEqual(
				query(collectionGroup('c', getFirestore()), where('a', '==', 1)),
				query(collectionGroup('c'), where('a', '==', 1))
			)
		).toBe(true)
		expect(
			queryEqual(
				query(collection('a/b/c'), orderBy('b')),
				query_(
					// @ts-expect-error
					collection('a/b/c'),
					orderBy('b').ref
				)
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(
			queryEqual(
				query(collection('a/b/c'), where('a', '==', 1)),
				query(
					colRef,
					// @ts-expect-error
					where('a', '==', 1)
				)
			)
		).toBe(false)
		expect(
			queryEqual(
				query(collectionGroup('c'), where('a', '==', 1)),
				query(collectionGroup('c', getFirestore()), where('b', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(collection('a/b/c'), orderBy('b')),
				query_(
					// @ts-expect-error
					collection('a/b/c'),
					where('a', '==', 1).ref
				)
			)
		).toBe(false)
	})
})
