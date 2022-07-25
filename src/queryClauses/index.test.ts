import { endAt } from './endAt'
import { endBefore } from './endBefore'
import { startAfter } from './startAfter'
import { startAt } from './startAt'
import { orderBy } from './orderBy'
import { getDocs, setDoc, deleteDoc } from '../operations'
import {
	userRefCreator,
	initializeApp,
	generateRandomData,
} from '../utilForTests'
import { query } from '../refs'

initializeApp()
const userRef = userRefCreator('ForCursorTest')
const docRef = userRef.doc('cursorEmptyTest')
const colRef = userRef.collection()
describe('test cursor emptiness', () => {
	it('test block empty argument, fail test', () => {
		;() => {
			// ! do not replace empty array with unique value in run time because it wil affect the ordering!
			// ! cursor should accept only tuple
			const arrNever: never[] = []
			const arrNumber: number[] = []
			const arr: [] = []
			// @ts-expect-error
			endAt()
			// @ts-expect-error
			endBefore()
			// @ts-expect-error
			startAfter()
			// @ts-expect-error
			startAt()
			// @ts-expect-error
			endAt(...arr)
			// @ts-expect-error
			endBefore(...arr)
			// @ts-expect-error
			startAfter(...arr)
			// @ts-expect-error
			startAt(...arr)
			// @ts-expect-error
			endAt(...arrNever)
			// @ts-expect-error
			endBefore(...arrNever)
			// @ts-expect-error
			startAfter(...arrNever)
			// @ts-expect-error
			startAt(...arrNever)
			// @ts-expect-error
			endAt(...arrNumber)
			// @ts-expect-error
			endBefore(...arrNumber)
			// @ts-expect-error
			startAfter(...arrNumber)
			// @ts-expect-error
			startAt(...arrNumber)
		}
	})
	it('test handle empty argument', async () => {
		const arr: string[] = []
		await setDoc(docRef, generateRandomData())
		const p1 = getDocs(
			query(
				colRef,
				orderBy('name'),
				// @ts-expect-error
				endAt(...arr)
			)
		)
		const p2 = getDocs(
			query(
				colRef,
				orderBy('name'),
				// @ts-expect-error
				endBefore(...arr)
			)
		)
		const p3 = getDocs(
			query(
				colRef,
				orderBy('name'),
				// @ts-expect-error
				startAt(...arr)
			)
		)
		const p4 = getDocs(
			query(
				colRef,
				orderBy('name'),
				// @ts-expect-error
				startAfter(...arr)
			)
		)
		const result = (await Promise.all([p1, p2, p3, p4])).reduce(
			(acc, querySnapshot) => {
				acc.push(querySnapshot.docs.length)
				return acc
			},
			[] as number[]
		)
		expect(result).toEqual([1, 1, 1, 1])
		await deleteDoc(docRef)
	})
})
