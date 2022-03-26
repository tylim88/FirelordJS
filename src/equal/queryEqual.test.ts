import { query as query_, getFirestore } from 'firebase/firestore'
import { query } from '../refs'
import { queryEqual } from './queryEqual'
import { initializeApp, userRefCreator } from '../utilForTests'
import { where, orderBy } from '../queryClauses'

initializeApp()
const colRef = userRefCreator().collection
const groupRef = userRefCreator().collectionGroup
describe('test queryEqual', () => {
	it('test equal', () => {
		expect(
			queryEqual(
				query(colRef(), where('a.b.c', '==', 1)),
				query(colRef(), where('a.b.c', '==', 1))
			)
		).toBe(true)
		expect(
			queryEqual(
				query(colRef(), orderBy('a.b')),
				query_(
					// @ts-expect-error
					colRef(),
					orderBy('a.b').ref
				)
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(
			queryEqual(
				query(colRef(), where('a.b.c', '==', 1)),
				query(colRef(), where('age', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(groupRef(), where('a.b.c', '==', 1)),
				query(groupRef(getFirestore()), where('age', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(colRef(), orderBy('a.b')),
				query_(
					// @ts-expect-error
					colRef(),
					where('a.b.c', '==', 1).ref
				)
			)
		).toBe(false)
	})
})
