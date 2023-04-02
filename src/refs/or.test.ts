import { query } from './query'
import { limit, orderBy, where } from '../queryClauses'
import { userRefCreator, initializeApp } from '../utilForTests'
import { documentId } from '../fieldPath'
import { Timestamp } from 'firebase/firestore'
import { getDocs } from '../operations'

initializeApp()
const ref = userRefCreator().collectionGroup()
const or = userRefCreator().or
// const and = userRefCreator().and
const fullDocPath = 'topLevel/FirelordTest/Users/a'
describe('test query ref', async () => {
	// it('test or queries', () => {
	// 	query(ref, or(where('age', '>', 2), limit(1), where('a.b.c', '<', 2)))
	// })
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

	it('In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field, positive test', async () => {
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(
						where(documentId(), '>', fullDocPath),
						where(documentId(), '!=', fullDocPath)
					)
				)
			)
		).resolves.not.toThrow()
		await expect(
			getDocs(query(ref, where('age', '>', 2), limit(1), where('age', '!=', 2)))
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(ref, where('a.b.c', '>', 2), limit(1), where('a.b.c', '!=', 2))
			)
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(ref, where('age', '<=', 2), limit(1), where('age', 'not-in', [2]))
			)
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(
					ref,
					where('a.b.c', 'not-in', [2]),
					limit(1),
					where('a.b.c', '<', 2)
				)
			)
		).resolves.not.toThrow()
	})

	it('If you include a filter with an inequality  ( <, <=, !=, not-in, >, or >=), your first ordering must be on the same field, negative case', () => {
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
				where('age', '>', 2),
				orderBy('a.b.c')
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				orderBy('a.i.j'),
				limit(1),
				where('age', '<=', 2)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('age', '!=', 2),
				limit(1),
				orderBy('a.b.c')
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('a.b.c', '<', 1),
				limit(1),
				orderBy('__name__')
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), 'not-in', ['a']),
				limit(1),
				orderBy('beenTo')
			)
		).toThrow()
	})

	it('If you include a filter with an inequality  ( <, <=, !=, not-in, >, or >=), your first ordering must be on the same field, positive case', async () => {
		await expect(
			getDocs(query(ref, orderBy('age'), where('age', '>=', 2)))
		).resolves.not.toThrow()
		await expect(
			getDocs(query(ref, where('a.k', '>=', new Date()), orderBy('a.k')))
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(
					ref,
					orderBy('a.k'),
					limit(1),
					where('a.k', '>=', Timestamp.fromDate(new Date()))
				)
			)
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(
					ref,
					where('a.k', '>=', Timestamp.fromMillis(8913748127389)),
					limit(1),
					orderBy('a.k')
				)
			)
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(
					ref,
					where(documentId(), '>=', fullDocPath),
					limit(1),
					orderBy('__name__')
				)
			)
		).resolves.not.toThrow()
	})

	it(`You can't order your query by a field included in an equality (==) or (in) clause, negative case`, async () => {
		// __name__ does not trigger runtime error, need open github issue
		await expect(
			getDocs(
				query(
					ref,
					// @ts-expect-error
					orderBy('__name__'),
					where(documentId(), '==', fullDocPath)
				)
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					// @ts-expect-error
					orderBy('__name__'),
					// @ts-expect-error
					where('__name__', '==', fullDocPath)
				)
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					// @ts-expect-error
					orderBy('age'),
					limit(1),
					where('age', '==', 1)
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					where('age', '==', 1),
					limit(1),
					// @ts-expect-error
					orderBy('age')
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					// @ts-expect-error
					orderBy('age'),
					where('age', '==', 1)
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					where('age', 'in', [1]),
					// @ts-expect-error
					orderBy('age')
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					// @ts-expect-error
					orderBy('age'),
					limit(1),
					where('age', '==', 1)
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					where('age', '==', 1),
					limit(1),
					// @ts-expect-error
					orderBy('age')
				)
			)
		).rejects.toThrow()
	})

	it(`You can't order your query by a field included in an equality (==) or in clause, positive case`, async () => {
		await expect(
			getDocs(
				query(ref, orderBy('__name__'), where(documentId(), '>', fullDocPath))
			)
		).resolves.not.toThrow()
		await expect(
			getDocs(query(ref, orderBy('age'), where('age', '>=', 1)))
		).resolves.not.toThrow()
		await expect(
			getDocs(query(ref, where('age', '==', 1), orderBy('a.k')))
		).resolves.not.toThrow()
		await expect(
			getDocs(query(ref, orderBy('age'), limit(1), where('age', 'not-in', [1])))
		).resolves.not.toThrow()
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'array-contains', 'a'),
					limit(1),
					orderBy('a.e')
				)
			)
		).resolves.not.toThrow()
	})
	it(`You can't combine 'not-in' with 'or', 'in', 'array-contains-any', or '!=' in the same query.. positive case`, async () => {
		// https://github.com/firebase/firebase-js-sdk/issues/7147
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'in', [['1']]),
					limit(1),
					where('a.e', 'array-contains-any', ['1'])
				)
			)
		).resolves.not.toThrow()

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'in', [['1']]),
					limit(1),
					where('a.e', 'in', [['1']])
				)
			)
		).resolves.not.toThrow()
	})
	it(`You can't combine 'not-in' with 'or', 'in', 'array-contains-any', or '!=' in the same query.. negative case`, async () => {
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

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'array-contains-any', ['1']),
					limit(1), // @ts-expect-error
					where('a.e', 'array-contains-any', ['1'])
				)
			)
		).rejects.toThrow()

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

	it(`You can use at most one array-contains or array-contains-any clause per query. You can't combine array-contains with array-contains-any, negative case`, async () => {
		// https://github.com/firebase/firebase-js-sdk/issues/7148
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'array-contains', '1'),
					limit(1),
					// @ts-expect-error
					where('a.e', 'array-contains', '2')
				)
			)
		).rejects.toThrow()
		// https://github.com/firebase/firebase-js-sdk/issues/7148
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'array-contains', '1'),
					limit(1),
					// @ts-expect-error
					where('a.e', 'array-contains-any', ['2'])
				)
			)
		).rejects.toThrow()

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		await expect(
			getDocs(
				query(
					ref,
					where('a.e', 'array-contains-any', ['2']),
					limit(1),
					// @ts-expect-error
					where('a.e', 'array-contains', '1')
				)
			)
		).rejects.toThrow()
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
})