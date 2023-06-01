import { query } from '../refs'
import { where } from './where'
import { userRefCreator, initializeApp } from '../utilForTests'
import { documentId } from '../fieldPath'

initializeApp()
const ref = userRefCreator().collectionGroup()

// runtime is tested on getDocs and onSnapshot
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
				where(documentId(), '>=', 1) // documentId must be string else throw
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '>=', 'a/b/c') // documentId must contain no segment
			)
		).toThrow()
	})

	it('test where with correct value to compare, should pass', () => {
		query(ref, where('role', '==', 'admin'))
		query(ref, where('age', '==', 1))
		query(ref, where('name', 'not-in', ['1']))
		query(ref, where('a.e', 'array-contains', '1'))
		query(ref, where('a.e', 'array-contains-any', ['1']))
		query(ref, where('a.e', 'in', [['1']]))
	})

	it('test literal type with const assertion, should pass', () => {
		query(ref, where('role', 'in', ['admin'] as const))
		query(ref, where('role', 'not-in', ['admin'] as const))
		query(ref, where('role', 'in', ['admin' as const]))
		query(ref, where('role', 'not-in', ['admin' as const]))
	})
	it('test literal type without const assertion, should pass', () => {
		query(ref, where('role', 'in', ['admin']))
		query(ref, where('role', 'not-in', ['admin']))
	})
	it('test block fresh empty array, negative case', () => {
		// @ts-expect-error
		query(ref, where('name', 'not-in', []))
		// @ts-expect-error
		query(ref, where('name', 'in', []))
		// @ts-expect-error
		query(ref, where('a.e', 'array-contains-any', []))
		// @ts-expect-error
		query(ref, where('a.e', 'in', []))
		// @ts-expect-error
		query(ref, where('a.e', 'not-in', []))
	})

	it('test block fresh empty array, positive case', () => {
		const arr: string[] = []
		const arr2D: string[][] = []
		query(ref, where('name', 'not-in', arr))
		query(ref, where('name', 'in', arr))
		query(ref, where('a.e', 'array-contains-any', arr))
		query(ref, where('a.e', 'in', arr2D))
		query(ref, where('a.e', 'not-in', arr2D))
	})
})
