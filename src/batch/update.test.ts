import { writeBatch } from '.'
import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { setDoc } from '../operations'
import { deleteField } from '../fieldValue'
import { getFirestore } from 'firebase/firestore'
import { WriteBatchUpdate, IsTrue, IsSame } from '../types'

initializeApp()
const userRef = userRefCreator()
// dont need to add TYPE test code anymore, because it share the same type with basic operation where type tests are done
// just need to test whether the return type is correct or not
describe('test update batch', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof writeBatch>['update']
		type B = WriteBatchUpdate
		IsTrue<IsSame<A, B>>()
	})
	it('test full update functionality', async () => {
		const batch = writeBatch(getFirestore())
		const docRef = userRef.doc('updateBatchTestCase')
		const docRef2 = userRef.doc('updateBatchTestCase2')
		const docRef3 = userRef.doc('updateBatchTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		await setDoc(docRef, generateRandomData())
		await setDoc(docRef2, generateRandomData())
		await setDoc(docRef3, generateRandomData())
		batch.update(docRef, data)
		batch.update(docRef2, data2)
		batch.update(docRef3, data3)
		await batch.commit()
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test same path, delete field, in hybrid', async () => {
		const batch = writeBatch()
		const data = generateRandomData()
		const ref = userRef.doc('updateBatchSpecificFieldTestCase')
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		batch.update(ref, {
			a: { 'i.j': deleteField() },
			'a.b': { f: arr },
			'a.b.c': num,
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await batch.commit()
		await readThenCompareWithWriteData(data, ref)
	})
})
