import {
	userRefCreator,
	readThenCompareWithWriteData,
	generateRandomData,
	initializeApp,
	compareReadAndWriteData,
} from '../utilForTests'
import { getFirestore } from 'firebase/firestore'
import { runTransaction } from '.'
import { setDoc, getDoc } from '../operations'
import { TransactionSet, IsTrue, IsSame } from '../types'
import { setCreator } from './set'
initializeApp()
const userRef = userRefCreator()
describe('test set transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof setCreator>
		type B = TransactionSet
		IsTrue<IsSame<A, B>>()
	})

	it('test set functionality', async () => {
		const docRef = userRef.doc('setTransactionTestCase')
		const docRef2 = userRef.doc('setTransactionTestCase2')
		const docRef3 = userRef.doc('setTransactionTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		await runTransaction(getFirestore(), async transaction => {
			transaction.set(docRef, data)
			transaction.set(docRef2, data2)
			transaction.set(docRef3, data3)
		})
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test read functionality', async () => {
		const docRef = userRef.doc('setTransactionTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(getFirestore(), async transaction => {
			const docSnap = await transaction.get(docRef)
			compareReadAndWriteData(data, docSnap)
		})
	})
	it('test delete functionality', async () => {
		const docRef = userRef.doc('setTransactionTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(getFirestore(), async transaction => {
			transaction.delete(docRef)
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})
	it('test merge true functionality', async () => {
		const ref = userRef.doc('setTransactionTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		await runTransaction(getFirestore(), async transaction => {
			transaction.set(ref, { a: { b: { f: [] } } }, { merge: true })
		})
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field functionality', async () => {
		const ref = userRef.doc('setTransactionTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		await runTransaction(getFirestore(), async transaction => {
			transaction.set(ref, { a: { b: { f: [] } } }, { mergeFields: ['a.b.f'] })
		})
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field empty functionality', async () => {
		const ref = userRef.doc('setTransactionTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		await runTransaction(getFirestore(), async transaction => {
			transaction.set(ref, { a: { b: { f: [] } } }, { mergeFields: [] })
		})
		await readThenCompareWithWriteData(data, ref)
	})
})
