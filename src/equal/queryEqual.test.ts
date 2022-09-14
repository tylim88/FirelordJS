import { query as query_ } from 'firebase/firestore'
import { query } from '../refs'
import { queryEqual } from './queryEqual'
import { initializeApp, userRefCreator } from '../utilForTests'
import { where, orderBy } from '../queryClauses'

initializeApp()
const colRef = userRefCreator().collection('FirelordTest')
const colRef2 = userRefCreator().collection('FirelordTest')
const groupRef = userRefCreator().collectionGroup
describe('test queryEqual', () => {
	it('test equal', () => {
		expect(
			queryEqual(
				query(colRef, where('a.b.c', '==', 1)),
				query(colRef2, where('a.b.c', '==', 1))
			)
		).toBe(true)
		expect(
			queryEqual(
				query(colRef, orderBy('a.b')),
				query_(
					// @ts-expect-error
					colRef2,
					orderBy('a.b').ref
				)
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(
			queryEqual(
				query(colRef, where('a.b.c', '==', 1)),
				query(colRef2, where('age', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(groupRef(), where('a.b.c', '==', 1)),
				query(groupRef(), where('age', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(colRef, orderBy('a.b')),
				query_(
					// @ts-expect-error
					colRef2,
					where('a.b.c', '==', 1).ref
				)
			)
		).toBe(false)
	})
})
