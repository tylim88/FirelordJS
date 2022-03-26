import { query } from '../refs'
import { orderBy } from './orderBy'
import { limit, limitToLast } from './limit'
import { userRefCreator, initializeApp } from '../utilForTests'

initializeApp()
const user = userRefCreator()
const ref = user.collectionGroup()
describe('test query ref', () => {
	it('test single limit type, should pass', () => {
		query(ref, limit(1))
	})

	it('You must specify at least one `orderBy` clause for `limitToLast` queries, negative case', () => {
		// throw in getDocs/onSnapshot
		query(
			ref,
			// @ts-expect-error
			limitToLast(1)
		)
	})

	it('You must specify at least one `orderBy` clause for `limitToLast` queries, positive case', () => {
		query(ref, orderBy('age'), orderBy('a.b.c'))
	})

	it('test orderBy wrong field path type, should fail', () => {
		query(
			ref,
			// @ts-expect-error
			orderBy('wrongPath2')
		)
	})

	it('test limitToLast type with orderBy, should pass', () => {
		query(ref, orderBy('a.i'), limitToLast(1))
	})
})
