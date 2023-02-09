import {
	userRefCreator,
	readThenCompareWithWriteData,
	generateRandomData,
	initializeApp,
	compareWriteDataWithDocSnapData,
} from '../utilForTests'
import { runTransaction } from '.'
import { setDoc, getDoc } from '../operations'
import { TransactionSet, IsTrue, IsSame } from '../types'
import { setCreator } from './set'
import { getFirestore } from 'firebase/firestore'

initializeApp()
const db = getFirestore()
describe('test set transaction and overloading', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof setCreator>
		type B = TransactionSet
		IsTrue<IsSame<A, B>>()
	})
	it('test transaction return type', () => {
		;async () => {
			const A = await runTransaction(async () => {
				return 1 as const
			})

			IsTrue<IsSame<typeof A, 1>>()
		}
	})
	it('test set functionality and return, with db', async () => {
		const docRef = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestCase'
		)
		const docRef2 = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestCase2'
		)
		const docRef3 = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestCase3'
		)
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		const result = await runTransaction(db, async transaction => {
			transaction.set(docRef, data)
			transaction.set(docRef2, data2)
			transaction.set(docRef3, data3)

			return 123
		})
		expect(result).toBe(123)
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test read functionality, with options', async () => {
		const docRef = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestCaseRead'
		)
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(
			async transaction => {
				const docSnap = await transaction.get(docRef)
				compareWriteDataWithDocSnapData(data, docSnap)
			},
			{ maxAttempts: 6 }
		)
	})
	it('test delete functionality, with db and options', async () => {
		const docRef = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestCaseRead'
		)
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(
			db,
			async transaction => {
				transaction.delete(docRef)
			},
			{ maxAttempts: 6 }
		)
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})
	it('test merge true functionality', async () => {
		const ref = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestMergeCase'
		)
		const data = generateRandomData()
		await setDoc(ref, data)
		await runTransaction(async transaction => {
			transaction.set(ref, { a: { b: { f: [] } } }, { merge: true })
		})
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field functionality', async () => {
		const ref = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestMergeCase'
		)
		const data = generateRandomData()
		await setDoc(ref, data)
		await runTransaction(async transaction => {
			transaction.set(ref, { a: { b: { f: [] } } }, { mergeFields: ['a.b.f'] })
		})
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field empty functionality', async () => {
		const ref = userRefCreator().doc(
			'FirelordTest',
			'setTransactionTestMergeCase'
		)
		const data = generateRandomData()
		await setDoc(ref, data)
		await runTransaction(async transaction => {
			transaction.set(ref, { a: { b: { f: [] } } }, { mergeFields: [] })
		})
		await readThenCompareWithWriteData(data, ref)
	})
})
