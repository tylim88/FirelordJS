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
		const docRef = userRefCreator().doc('FirelordTest', 'updateBatchTestCase')
		const docRef2 = userRefCreator().doc('FirelordTest', 'updateBatchTestCase2')
		const docRef3 = userRefCreator().doc('FirelordTest', 'updateBatchTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		const p1 = setDoc(docRef, generateRandomData())
		const p2 = setDoc(docRef2, generateRandomData())
		const p3 = setDoc(docRef3, generateRandomData())
		await Promise.all([p1, p2, p3])
		batch.update(docRef, data)
		batch.update(docRef2, data2)
		batch.update(docRef3, data3)
		await batch.commit()
		const p4 = readThenCompareWithWriteData(data, docRef)
		const p5 = readThenCompareWithWriteData(data2, docRef2)
		const p6 = readThenCompareWithWriteData(data3, docRef3)
		await Promise.all([p4, p5, p6])
	})
	it('test same path, delete field, in hybrid', async () => {
		const batch = writeBatch()
		const data = generateRandomData()
		const ref = userRefCreator().doc(
			'FirelordTest',
			'updateBatchSpecificFieldTestCase'
		)
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
