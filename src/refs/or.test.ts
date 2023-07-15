import { query } from './query'
import { limit, orderBy, where } from '../queryConstraints'
import { userRefCreator, initializeApp } from '../utilForTests'
import { Timestamp } from 'firebase/firestore'
import { getDocs } from '../operations'

initializeApp()
const ref = userRefCreator().collectionGroup()
const or = userRefCreator().or
const fullDocPath = 'topLevel/FirelordTest/Users/a'
describe('test query ref', async () => {
	it('In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field, negative test', () => {
		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					where('__name__', '>', fullDocPath),
					// @ts-expect-error
					where('a.b.c', '!=', 2)
				)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					where('age', '>', 2),
					// @ts-expect-error
					where('a.b.c', '!=', 2)
				)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					where('age', '>', 2),
					// @ts-expect-error
					where('a.b.c', '!=', 2)
				)
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
						where('__name__', '>', fullDocPath),
						where('__name__', '!=', fullDocPath)
					)
				)
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(ref, limit(1), or(where('age', '>', 2), where('age', '!=', 2)))
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(where('a.b.c', '>', 2), where('a.b.c', '!=', 2))
				)
			)
		).resolves.not.toThrow()
	})
	it(`You cannot use 'not-in' in 'or' query, nested or not, negative test`, async () => {
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					// @ts-expect-error
					or(
						where('age', '==', 2),
						// @ts-expect-error
						where('a.b.c', 'not-in', [2])
					)
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					// @ts-expect-error
					or(
						// @ts-expect-error
						where('age', 'not-in', [2]),
						where('a.b.c', '==', 2)
					)
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					// @ts-expect-error
					or(
						where('age', '==', 2),
						// @ts-expect-error
						where('age', 'not-in', [2])
					)
				)
			)
		).rejects.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					// @ts-expect-error
					or(
						// @ts-expect-error
						where('a.b.c', 'not-in', [2]),
						where('a.b.c', '==', 2)
					)
				)
			)
		).rejects.toThrow()
	})

	it('If you include a filter with an inequality  ( <, <=, !=, not-in, >, or >=), your first ordering must be on the same field, negative case', async () => {
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				orderBy('a.i'),
				or(where('age', '>=', 2), where('a.b.c', '==', 2))
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				or(
					where('age', '>=', 2),
					// @ts-expect-error
					where('a.b.c', '<', 2)
				),
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
				limit(1),
				orderBy('a.b.c'),
				or(where('age', '!=', 2))
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				limit(1),
				orderBy('__name__'),
				or(where('a.b.c', '<', 1))
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				limit(1),
				orderBy('beenTo'),
				// @ts-expect-error
				or(where('__name__', 'not-in', ['a']), where('a.b.c', '<', 1))
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				orderBy('age'),
				limit(1),
				// @ts-expect-error
				or(where('age', 'not-in', [1]), where('a.b.c', '<', 1))
			)
		).toThrow()
	})

	it('If you include a filter with an inequality  ( <, <=, !=, not-in, >, or >=), your first ordering must be on the same field, positive case', async () => {
		await expect(
			getDocs(query(ref, orderBy('age'), or(where('age', '>=', 2))))
		).resolves.not.toThrow()

		await expect(
			getDocs(query(ref, or(where('a.k', '>=', new Date())), orderBy('a.k')))
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					orderBy('a.k'),
					limit(1),
					or(where('a.k', '>=', Timestamp.fromDate(new Date())))
				)
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					or(where('a.k', '>=', Timestamp.fromMillis(8913748127389))),
					limit(1),
					orderBy('a.k')
				)
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					or(where('__name__', '>=', fullDocPath)),
					limit(1),
					orderBy('__name__')
				)
			)
		).resolves.not.toThrow()
	})

	it(`You can't order your query by a field included in an equality (==) or in clause, positive case`, async () => {
		await expect(
			getDocs(
				query(ref, orderBy('__name__'), or(where('__name__', '>', fullDocPath)))
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(query(ref, orderBy('age'), or(where('age', '>=', 1))))
		).resolves.not.toThrow()

		await expect(
			getDocs(query(ref, or(where('age', '==', 1)), orderBy('a.k')))
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					ref,
					or(where('a.e', 'array-contains', 'a')),
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
					limit(1),
					or(
						where('a.e', 'in', [['1']]),
						where('a.e', 'array-contains-any', ['1'])
					)
				)
			)
		).resolves.not.toThrow()

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(where('a.e', 'in', [['1']]), where('a.e', 'in', [['1']]))
				)
			)
		).resolves.not.toThrow()
	})
	it(`You can't combine 'not-in' with 'or', 'in', 'array-contains-any', or '!=' in the same query.. negative case`, async () => {
		// ! this is a special case, it does not throw if there is only one clause in `or` query
		await expect(
			getDocs(
				query(ref, limit(1), or(where('__name__', 'not-in', [fullDocPath])))
			)
		).resolves.not.toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					// @ts-expect-error
					where('__name__', 'not-in', [fullDocPath]),
					where('age', '==', '1')
				)
			)
		).not.toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					// @ts-expect-error
					where('__name__', 'not-in', [fullDocPath]),
					where('a.e', 'array-contains-any', ['1'])
				)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					// @ts-expect-error
					where('name', 'not-in', ['1']),
					where('a.e', 'array-contains-any', ['1'])
				)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					// @ts-expect-error
					where('name', 'not-in', ['1']),
					where('a.e', 'in', [['1']])
				)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1), // @ts-expect-error
				or(
					// @ts-expect-error
					where('name', 'not-in', ['1']),
					where('a.e', 'not-in', [['1']])
				)
			)
		).toThrow()
	})
	it(`You can't combine not-in with not equals !=, negative case`, () => {
		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					// @ts-expect-error
					where('__name__', 'not-in', [fullDocPath]),
					where('age', '!=', 1)
				)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					// @ts-expect-error
					where('age', 'not-in', [1]),
					where('age', '!=', 1)
				)
			)
		).toThrow()
	})

	it(`You can use at most one array-contains or array-contains-any clause per query. You can't combine array-contains with array-contains-any, except for or query`, async () => {
		// https://github.com/firebase/firebase-js-sdk/issues/7148
		// ! need new rule for this
		// currently no rule
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(
						where('a.e', 'array-contains', '1'),
						where('a.e', 'array-contains', '2')
					)
				)
			)
		).resolves.not.toThrow()

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		// ! need new rule for this
		// currently no rule
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(
						where('a.e', 'array-contains', '1'),
						where('a.e', 'array-contains-any', ['2'])
					)
				)
			)
		).resolves.not.toThrow()

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		// ! need new rule for this
		// currently no rule
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(
						where('a.e', 'array-contains-any', ['2']),
						where('a.e', 'array-contains', '1')
					)
				)
			)
		).resolves.not.toThrow()

		// https://github.com/firebase/firebase-js-sdk/issues/7148
		// ! need new rule for this
		// currently no rule
		await expect(
			getDocs(
				query(
					ref,
					limit(1),
					or(
						where('a.e', 'array-contains-any', ['1']),
						where('a.e', 'array-contains-any', ['1'])
					)
				)
			)
		).resolves.not.toThrow()
	})

	it(`You cannot use more than one '!=' filter (undocumented limitation), negative case`, () => {
		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					where('__name__', '!=', fullDocPath),
					// @ts-expect-error
					where('age', '!=', 1)
				)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					where('age', '!=', 1),
					// @ts-expect-error
					where('age', '!=', 1)
				)
			)
		).toThrow()

		expect(() =>
			query(
				ref,
				limit(1),
				// @ts-expect-error
				or(
					where('age', '!=', 1),
					// @ts-expect-error
					where('a.b.c', '!=', 1)
				)
			)
		).toThrow()
	})
})
