import {
	userRefCreator,
	initializeApp,
	readThenCompareWithWriteData,
	generateRandomData,
} from '../utilForTests'
import { getFirestore } from 'firebase/firestore'
import { writeBatch } from '.'
import { setDoc, getDoc } from '../operations'
import { IsTrue, IsSame, WriteBatchSet } from '../types'

initializeApp()
// dont need to add TYPE test code anymore, because it share the same type with basic operation where type tests are done
// just need to test whether the return type is correct or not
describe('test set batch', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof writeBatch>['set']
		type B = WriteBatchSet
		IsTrue<IsSame<A, B>>()
	})
	it('test set functionality', async () => {
		const batch = writeBatch(getFirestore())
		const docRef = userRefCreator().doc('FirelordTest', 'setBatchTestCase')
		const docRef2 = userRefCreator().doc('FirelordTest', 'setBatchTestCase2')
		const docRef3 = userRefCreator().doc('FirelordTest', 'setBatchTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		batch.set(docRef, data)
		batch.set(docRef2, data2)
		batch.set(docRef3, data3)
		await batch.commit()
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test delete functionality', async () => {
		const batch = writeBatch(getFirestore())
		const docRef = userRefCreator().doc('FirelordTest', 'setBatchTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		batch.delete(docRef)
		await batch.commit()
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})
	it('test merge true functionality', async () => {
		const batch = writeBatch(getFirestore())
		const ref = userRefCreator().doc('FirelordTest', 'setBatchTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		batch.set(ref, { a: { b: { f: [] } } }, { merge: true })
		await batch.commit()
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field functionality', async () => {
		const batch = writeBatch(getFirestore())
		const ref = userRefCreator().doc('FirelordTest', 'setBatchTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		batch.set(ref, { a: { b: { f: [] } } }, { mergeFields: ['a.b.f'] })
		await batch.commit()
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field empty functionality', async () => {
		const batch = writeBatch(getFirestore())
		const ref = userRefCreator().doc('FirelordTest', 'setBatchTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		batch.set(ref, { a: { b: { f: [] } } }, { mergeFields: [] })
		await batch.commit()
		await readThenCompareWithWriteData(data, ref)
	})
})
