import { getCountFromServer } from './getCountFromServer'
import {
	generateRandomData,
	initializeApp,
	userRefCreator,
} from '../utilForTests'
import { query } from '../refs'
import { where } from '../queryClauses'
import { setDoc } from './setDoc'
import { deleteDoc } from './deleteDoc'
import crypto from 'crypto'

initializeApp()

const userRef = userRefCreator()

describe('test getCountFromServer', () => {
	const doc1 = userRef.doc('ForAggCountTest', '1')
	const doc2 = userRef.doc('ForAggCountTest', '2')
	const doc3 = userRef.doc('ForAggCountTest', '3')
	const doc4 = userRef.doc('ForAggCountTest', '4')
	const uniqueValue = { name: crypto.randomUUID() }
	beforeEach(async () => {
		const deletePromises = [doc1, doc2, doc3, doc4].map(docRef => {
			return deleteDoc(docRef)
		})

		await Promise.allSettled(deletePromises)
		const setPromises = [doc1, doc2, doc3].map(docRef => {
			return setDoc(docRef, { ...generateRandomData(), ...uniqueValue })
		})
		await setDoc(doc4, generateRandomData())
		await Promise.all(setPromises)
	})

	it('test aggregated count of collection', async () => {
		const snapshot2 = await getCountFromServer(
			query(userRef.collection('ForAggCountTest'))
		)
		expect(snapshot2.data().count).toBe(4)
	})
	it('test aggregated count of query', async () => {
		const snapshot = await getCountFromServer(
			query(
				userRef.collection('ForAggCountTest'),
				where('name', '==', uniqueValue.name)
			)
		)
		expect(snapshot.data().count).toBe(3)
	})
})
