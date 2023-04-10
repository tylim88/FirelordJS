import { query } from '../refs'
import { orderBy } from './orderBy'
import { limit, limitToLast } from './limit'
import { userRefCreator, initializeApp, User, Parent } from '../utilForTests'
import { endBefore } from './endBefore'
import { startAfter } from './startAfter'
import { startAt } from './startAt'
import { endAt } from './endAt'
import { QueryDocumentSnapshot, DocumentSnapshot } from '../types'
import { documentId } from '../fieldPath'

initializeApp()
const ref = userRefCreator().collectionGroup()
const ParentDocumentSnapshot = 1 as unknown as DocumentSnapshot<Parent>
const ParentQueryDocumentSnapshot =
	1 as unknown as QueryDocumentSnapshot<Parent>
const UserDocumentSnapshot = 1 as unknown as DocumentSnapshot<User>
const UserQueryDocumentSnapshot = 1 as unknown as QueryDocumentSnapshot<User>

describe('test query ref', () => {
	it('test single limit type, should pass', () => {
		query(ref, limit(1))
		query(ref, limit(1), limit(1))
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
		query(ref, orderBy('age'), limitToLast(1), limitToLast(1))
	})

	it('Too many arguments provided to startAt/startAfter/endAt/endBefore(). The number of arguments must be less than or equal to the number of orderBy() clauses, negative case', () => {
		// cursor with has x number of arguments must has x number of orderBy clause before that cursor
		// does not throw on the spot if orderBy clause exist first, still throw in getDocs and onSnapshot
		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				startAfter(1)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				endBefore(1),
				orderBy('a.b.c')
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				endAt(UserQueryDocumentSnapshot)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				endAt(UserDocumentSnapshot)
			)
		).toThrow()

		query(
			ref,
			orderBy('a.b.c'),
			limit(1),
			// @ts-expect-error
			startAt('1')
		)

		query(
			ref,
			orderBy('a.b.c'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(ParentQueryDocumentSnapshot)
		)

		query(
			ref,
			orderBy('a.b.c'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(ParentDocumentSnapshot)
		)

		expect(() =>
			query(
				ref,
				orderBy('a.b.c'),
				limit(1),
				startAt(1),
				// @ts-expect-error
				endAt(1, 2)
			)
		).toThrow() // throw because endAt has more argument than the number of orderBy

		query(
			ref,
			orderBy('a.b.c'),
			orderBy('a.k'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(1, 2)
		)

		expect(() =>
			query(
				ref,
				orderBy('a.b.c'),
				orderBy('__name__'),
				limit(1),
				startAt(1),
				// @ts-expect-error
				endAt(1, 2)
			)
		).toThrow() // throw because passing number to doc name

		expect(() =>
			query(
				ref,
				orderBy('a.b.c'),
				orderBy('__name__'),
				limit(1),
				startAt(1),
				// @ts-expect-error
				endAt(1, ParentQueryDocumentSnapshot)
			)
		).toThrow() // the only value __name__ can use for cursor is full doc path

		expect(() =>
			query(
				ref,
				orderBy('a.b.c'),
				orderBy(documentId()),
				limit(1),
				startAt(1),
				// @ts-expect-error
				endAt(1, ParentDocumentSnapshot)
			)
		).toThrow() // the only value __name__ can use for cursor is full doc path

		query(
			ref,
			orderBy('a.b.c'),
			orderBy('__name__'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(1, 'topLevel/Firelor1dTest/Users/123' as const)
		)

		query(
			ref,
			orderBy('a.b.c'),
			orderBy(documentId()),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(UserQueryDocumentSnapshot, 'a/123' as const)
		)

		query(
			ref,
			orderBy('a.b.c'),
			orderBy('__name__'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(UserQueryDocumentSnapshot, `topLevel/FirelordTest/Users/123`)
		)
	})
	it('Too many arguments provided to startAt/startAfter/endAt/endBefore(). The number of arguments must be less than or equal to the number of orderBy() clauses, positive case', () => {
		// cursor with has x number of arguments must has x number of orderBy clause before that cursor

		query(ref, limit(1), orderBy('a.b.c'), endBefore(1))

		query(ref, orderBy('a.b.c'), limit(1), startAt(1))

		query(ref, orderBy('a.b.c'), limit(1), startAt(UserQueryDocumentSnapshot))

		query(ref, orderBy('a.b.c'), limit(1), startAt(UserDocumentSnapshot))

		query(ref, orderBy('a.b.c'), limit(1), startAt(1), endAt(1))

		query(ref, orderBy('a.b.c'), limit(1), startAt(1), endAt(1))

		query(
			ref,
			orderBy('a.b.c'),
			limit(1),
			startAt(UserQueryDocumentSnapshot),
			endAt(1)
		)

		query(
			ref,
			orderBy('a.b.c'),
			limit(1),
			startAt(1),
			endAt(UserDocumentSnapshot)
		)

		query(
			ref,
			orderBy('a.b.c'),
			orderBy('a.k'),
			limit(1),
			startAt(1),
			endAt(1, new Date())
		)
		query(
			ref,
			orderBy('a.b.c'),
			orderBy('__name__'),
			limit(1),
			startAt(1),
			endAt(1, `topLevel/FirelordTest/Users/123` as const) // ! error without as const but still pass tsc check!!!
		)

		query(
			ref,
			orderBy('a.b.c'),
			orderBy('a.k'),
			limit(1),
			startAt(UserDocumentSnapshot),
			endAt(1, new Date())
		)
	})
})
