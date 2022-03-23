import { query } from '../refs'
import { where } from './where'
import { userRefCreator, initializeApp } from '../utilForTests'
import { documentId } from '../fieldPath'

initializeApp()
const user = userRefCreator()
const ref = user.collectionGroup()
describe('test query ref', () => {
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

	it('test where with correct value to compare, should pass', () => {
		query(ref, where('age', '==', 1))
		query(ref, where('name', 'not-in', ['1']))
		query(ref, where('a.e', 'array-contains', '1'))
		query(ref, where('a.e', 'array-contains-any', ['1']))
		query(ref, where('a.e', 'in', [['1']]))
	})
})
