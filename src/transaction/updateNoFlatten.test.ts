import { runTransaction } from '.'

import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { IsTrue, IsSame, TransactionUpdateNoFlatten } from '../types'
import { setDoc } from '../operations'
import { deleteField } from '../fieldValues'
import { updateNoFlattenCreator } from './updateNoFlatten'

initializeApp()
describe('test updateNoFlatten transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof updateNoFlattenCreator>
		type B = TransactionUpdateNoFlatten
		IsTrue<IsSame<A, B>>()
	})

	it('test functionality', async () => {
		const docRef = userRefCreator().doc(
			'FirelordTest',
			'updateTransactionTestCase'
		)
		const docRef2 = userRefCreator().doc(
			'FirelordTest',
			'updateTransactionTestCase2'
		)
		const docRef3 = userRefCreator().doc(
			'FirelordTest',
			'updateTransactionTestCase3'
		)
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		const p1 = setDoc(docRef, generateRandomData())
		const p2 = setDoc(docRef2, generateRandomData())
		const p3 = setDoc(docRef3, generateRandomData())
		await Promise.all([p1, p2, p3])
		await runTransaction(async transaction => {
			transaction.updateNoFlatten(docRef, data)
			transaction.updateNoFlatten(docRef2, data2)
			transaction.updateNoFlatten(docRef3, data3)
		})
		const p4 = readThenCompareWithWriteData(data, docRef)
		const p5 = readThenCompareWithWriteData(data2, docRef2)
		const p6 = readThenCompareWithWriteData(data3, docRef3)
		await Promise.all([p4, p5, p6])
	})
	it('test delete field type', async () => {
		;async () => {
			const ref = userRefCreator().doc(
				'FirelordTest',
				'updateTransactionSpecificFieldTestCase'
			)
			const date = new Date()
			const arr = [{ g: false, h: date, m: 9 }]
			const num = Math.random()
			await runTransaction(async transaction => {
				await transaction.updateNoFlatten(ref, {
					age: deleteField(),
					a: {
						// cannot assign delete field in nested property of non-flatten operation data
						// @ts-expect-error
						'i.j': deleteField(),
					},
					'a.b': { f: arr },
					'a.b.c': num,
				})
			})
		}
	})
})
