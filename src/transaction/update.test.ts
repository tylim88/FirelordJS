import { runTransaction } from '.'

import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { getFirestore } from 'firebase/firestore'
import { IsTrue, IsSame, TransactionUpdate } from '../types'
import { setDoc, getDoc } from '../operations'
import { deleteField } from '../fieldValue'
import { updateCreator } from './update'

initializeApp()
const userRef = userRefCreator()

describe('test update transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof updateCreator>
		type B = TransactionUpdate
		IsTrue<IsSame<A, B>>()
	})

	it('test functionality', async () => {
		const docRef = userRef.doc('updateTransactionTestCase')
		const docRef2 = userRef.doc('updateTransactionTestCase2')
		const docRef3 = userRef.doc('updateTransactionTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		await setDoc(docRef, generateRandomData())
		await setDoc(docRef2, generateRandomData())
		await setDoc(docRef3, generateRandomData())
		await runTransaction(getFirestore(), async transaction => {
			transaction.update(docRef, data)
			transaction.update(docRef2, data2)
			transaction.update(docRef3, data3)
		})
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test same path, delete field, in hybrid', async () => {
		const data = generateRandomData()
		const ref = userRef.doc('updateTransactionSpecificFieldTestCase')
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await runTransaction(getFirestore(), async transaction => {
			await transaction.update(ref, {
				a: { 'i.j': deleteField() },
				'a.b': { f: arr },
				'a.b.c': num,
			})
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await readThenCompareWithWriteData(data, ref)
	})
})
