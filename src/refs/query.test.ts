import { query } from './query'
import {
	limit,
	limitToLast,
	orderBy,
	where,
	startAt,
	endBefore,
	endAt,
	startAfter,
} from '../queryClauses'
import { userRefCreator, initializeApp } from '../utilForTests'
import { documentId } from '../fieldPath'
import { Timestamp } from 'firebase/firestore'

initializeApp()
const user = userRefCreator()
const ref = user.collectionGroup()
const fullDocPath = 'topLevel/FirelordTest/Users/a' as const // https://stackoverflow.com/questions/71575344/typescript-stop-object-type-from-widening-generic/71575870#71575870
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

	it('test wrong where field path', () => {
		query(
			ref,
			// @ts-expect-error
			where('a1ge', '>=', 2)
		)
		query(
			ref,
			// @ts-expect-error
			where('a.b.c1', '>=', 2)
		)
	})

	it('test where with incorrect value to compare, should fail', () => {
		// throw error on in, not-in and array-contains-any if the value is not array
		query(
			ref,
			// @ts-expect-error
			where('age', '==', '1')
		)
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('name', 'not-in', '1')
			)
		).toThrow()
		query(
			ref,
			// @ts-expect-error
			where('a.e', 'array-contains', ['1'])
		)
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('a.e', 'array-contains-any', '1')
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('a.e', 'not-in', '1')
			)
		).toThrow()
		query(
			ref,
			// @ts-expect-error
			where('a.e', 'in', ['1'])
		)
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '>=', 1)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '>=', 'a/b/c')
			)
		).toThrow()
	})
	it('If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field, negative case', () => {
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				orderBy('a.i'),
				where('age', '>=', 2)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('age', '>=', 2),
				orderBy('a.i')
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				orderBy('a.i'),
				limit(1),
				where('age', '>=', 2)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('age', '>=', 2),
				limit(1),
				orderBy('a.i')
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('a.b.c', '>=', 1),
				limit(1),
				orderBy('__name__')
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '>=', 'a'),
				limit(1),
				orderBy('a.i')
			)
		).toThrow()
	})

	it('If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field, positive case', () => {
		query(ref, orderBy('age'), where('age', '>=', 2))
		query(ref, where('a.k', '>=', new Date()), orderBy('a.k'))
		query(
			ref,
			orderBy('a.k'),
			limit(1),
			where('a.k', '>=', Timestamp.fromDate(new Date()))
		)
		query(
			ref,
			where('a.k', '>=', Timestamp.fromMillis(8913748127389)),
			limit(1),
			orderBy('a.k')
		)
		query(
			ref,
			where(documentId(), '>=', fullDocPath),
			limit(1),
			orderBy('__name__')
		)
	})

	it('test where with correct value to compare, should pass', () => {
		query(ref, where('age', '==', 1))
		query(ref, where('name', 'not-in', ['1']))
		query(ref, where('a.e', 'array-contains', '1'))
		query(ref, where('a.e', 'array-contains-any', ['1']))
		query(ref, where('a.e', 'in', [['1']]))
	})

	it(`You can't order your query by a field included in an equality (==) or (in) clause, negative case`, () => {
		// throw in getDocs/onSnapshot

		query(
			ref,
			// @ts-expect-error
			orderBy('__name__'),
			where(documentId(), '==', fullDocPath)
		)
		query(
			ref,
			// @ts-expect-error
			orderBy('age'),
			limit(1),
			where('age', '==', 1)
		)
		query(
			ref,
			where('age', '==', 1),
			limit(1),
			// @ts-expect-error
			orderBy('age')
		)
		query(
			ref,
			// @ts-expect-error
			orderBy('age'),
			where('age', '==', 1)
		)
		query(
			ref,
			where('age', 'in', [1]),
			// @ts-expect-error
			orderBy('age')
		)
		query(
			ref,
			// @ts-expect-error
			orderBy('age'),
			limit(1),
			where('age', '==', 1)
		)
		query(
			ref,
			where('age', '==', 1),
			limit(1),
			// @ts-expect-error
			orderBy('age')
		)
	})

	it(`You can't order your query by a field included in an equality (==) or in clause, positive case`, () => {
		query(ref, orderBy('__name__'), where(documentId(), '>', fullDocPath))
		query(ref, orderBy('age'), where('age', '>=', 1))
		query(ref, where('age', '==', 1), orderBy('a.k'))
		query(ref, orderBy('age'), limit(1), where('age', 'not-in', [1]))
		query(ref, where('a.e', 'array-contains', 'a'), limit(1), orderBy('a.e'))
	})

	it(`You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query. negative case`, () => {
		expect(() =>
			query(
				ref,
				where(documentId(), 'not-in', [fullDocPath]),
				limit(1), // @ts-expect-error
				where('a.e', 'array-contains-any', ['1'])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('name', 'not-in', ['1']),
				limit(1), // @ts-expect-error
				where('a.e', 'array-contains-any', ['1'])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('a.e', 'in', [['1']]),
				limit(1), // @ts-expect-error
				where('a.e', 'array-contains-any', ['1'])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('name', 'not-in', ['1']),
				limit(1), // @ts-expect-error
				where('a.e', 'in', [['1']])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('a.e', 'array-contains-any', ['1']),
				limit(1), // @ts-expect-error
				where('a.e', 'array-contains-any', ['1'])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('a.e', 'in', [['1']]),
				limit(1), // @ts-expect-error
				where('a.e', 'in', ['1'])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('name', 'not-in', ['1']),
				limit(1), // @ts-expect-error
				where('a.e', 'not-in', [['1']])
			)
		).toThrow()
	})
	it(`You can't combine not-in with not equals !=, negative case`, () => {
		expect(() =>
			query(
				ref,
				where(documentId(), 'not-in', [fullDocPath]),
				limit(1),
				// @ts-expect-error
				where('age', '!=', 1)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', 'not-in', [1]),
				limit(1),
				// @ts-expect-error
				where('age', '!=', 1)
			)
		).toThrow()
	})

	it(`You cannot use more than one '!=' filter (undocumented limitation), negative case`, () => {
		expect(() =>
			query(
				ref,
				where(documentId(), '!=', fullDocPath),
				limit(1),
				// @ts-expect-error
				where('age', '!=', 1)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', '!=', 1),
				limit(1),
				// @ts-expect-error
				where('age', '!=', 1)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', '!=', 1),
				limit(1),
				// @ts-expect-error
				where('a.b.c', '!=', 1)
			)
		).toThrow()
	})

	it(`You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any, negative case`, () => {
		expect(() =>
			query(
				ref,
				where('a.e', 'array-contains', '1'),
				limit(1),
				// @ts-expect-error
				where('a.e', 'array-contains', '2')
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('a.e', 'array-contains', '1'),
				limit(1),
				// @ts-expect-error
				where('a.e', 'array-contains-any', ['2'])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('a.e', 'array-contains-any', ['2']),
				limit(1),
				// @ts-expect-error
				where('a.e', 'array-contains', '1')
			)
		).toThrow()
	})

	it('In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field, negative test', () => {
		expect(() =>
			query(
				ref,
				where(documentId(), '>', fullDocPath),
				limit(1),
				// @ts-expect-error
				where('a.b.c', '!=', 2)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', '>', 2),
				limit(1),
				// @ts-expect-error
				where('a.b.c', '!=', 2)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', '>', 2),
				limit(1),
				// @ts-expect-error
				where('a.b.c', '!=', 2)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', '<=', 2),
				limit(1),
				// @ts-expect-error
				where('a.b.c', 'not-in', [2])
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				where('age', 'not-in', [2]),
				limit(1),
				// @ts-expect-error
				where('a.b.c', '<', 2)
			)
		).toThrow()
	})
	it('In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field, positive test', () => {
		query(
			ref,
			where(documentId(), '>', fullDocPath),
			limit(1),
			where(documentId(), '!=', fullDocPath)
		)
		query(ref, where('age', '>', 2), limit(1), where('age', '!=', 2))
		query(ref, where('a.b.c', '>', 2), limit(1), where('a.b.c', '!=', 2))
		query(ref, where('age', '<=', 2), limit(1), where('age', 'not-in', [2]))
		query(ref, where('a.b.c', 'not-in', [2]), limit(1), where('a.b.c', '<', 2))
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
			endAt(1, 2)
		)

		query(
			ref,
			orderBy('a.b.c'),
			orderBy('a.k'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(1, 2)
		)
		query(
			ref,
			orderBy('a.b.c'),
			orderBy('__name__'),
			limit(1),
			startAt(1),
			// @ts-expect-error
			endAt(1, 2)
		)
	})
	it('Too many arguments provided to startAt/startAfter/endAt/endBefore(). The number of arguments must be less than or equal to the number of orderBy() clauses, positive case', () => {
		// cursor with has x number of arguments must has x number of orderBy clause before that cursor

		query(ref, limit(1), orderBy('a.b.c'), endBefore(1))

		query(ref, orderBy('a.b.c'), limit(1), startAt(1))

		query(ref, orderBy('a.b.c'), limit(1), startAt(1), endAt(1))

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
			endAt(1, '123')
		)
	})

	it('test empty array for in, not-in, array-contains-any, should pass', () => {
		query(ref, where('age', 'not-in', []))
		query(ref, where('age', 'in', []))
		query(ref, where('a.e', 'array-contains-any', []))
	})
})
