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
import { limit, limitToLast } from './limit'

initializeApp()

const r1 = userRefCreator().doc('ForCursorTest', 'getDocsCursorTest1')
const r2 = userRefCreator().doc('ForCursorTest', 'getDocsCursorTest2')
const r3 = userRefCreator().doc('ForCursorTest', 'getDocsCursorTest3')
const r4 = userRefCreator().doc('ForCursorTest', 'getDocsCursorTest4')
const docRef = userRefCreator().doc('ForCursorTest', 'cursorEmptyTest')

describe('test cursor emptiness', () => {
	beforeEach(async () => {
		await Promise.all([
			deleteDoc(docRef),
			deleteDoc(r1),
			deleteDoc(r2),
			deleteDoc(r3),
			deleteDoc(r4),
		])
	})
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
		const colRef = userRefCreator().collection('ForCursorTest')
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
	})

	it('cursor and limit test', async () => {
		const d1 = generateRandomData()
		const d2 = generateRandomData()
		const d3 = generateRandomData()
		const d4 = generateRandomData()
		const p1 = setDoc(r1, d1)
		const p2 = setDoc(r2, d2)
		const p3 = setDoc(r3, d3)
		const p4 = setDoc(r4, d4)

		await Promise.all([p1, p2, p3, p4])

		const colRef = userRefCreator().collection('ForCursorTest')

		expect.assertions(5)

		const p5 = getDocs(
			query(colRef, orderBy('age'), endAt(d3.age as number))
		).then(querySnapshot => {
			const doc = querySnapshot.docs[querySnapshot.docs.length - 1]
			if (doc) {
				const data = doc.data()
				expect(data.age).toBe(d3.age)
			}
		})
		const p6 = getDocs(
			query(colRef, orderBy('age'), startAt(d1.age as number))
		).then(querySnapshot => {
			const doc = querySnapshot.docs[0]
			if (doc) {
				const data = doc.data()
				expect(data.age).toBe(d1.age)
			}
		})

		const p7 = getDocs(query(colRef, limit(1), limit(4))).then(
			querySnapshot => {
				expect(querySnapshot.docs.length).toBe(4)
			}
		)

		const p8 = getDocs(
			query(colRef, orderBy('age'), limitToLast(4), limitToLast(1))
		).then(querySnapshot => {
			expect(querySnapshot.docs.length).toBe(1)
		})

		const p9 = getDocs(
			query(colRef, orderBy('age'), limit(4), limitToLast(1))
		).then(querySnapshot => {
			expect(querySnapshot.docs.length).toBe(1)
		})
		await Promise.all([p5, p6, p7, p8, p9])
	})
})
