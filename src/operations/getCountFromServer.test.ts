import { getCountFromServer } from './getCountFromServer'
import {
	generateRandomData,
	initializeApp,
	userRefCreator,
} from '../utilForTests'
import { query } from '../refs'
import { where } from '../queryClauses'
import { setDoc } from './setDoc'

initializeApp()

const userRef = userRefCreator()

describe('test getCountFromServer', () => {
	it('test count', async () => {
		const uniqueValue = { name: '%#$E#$%^&*YM&HU*(&NY&' }
		const doc1 = userRef.doc('FirelordTest', 'A1')
		const doc2 = userRef.doc('FirelordTest', 'A2')
		const doc3 = userRef.doc('FirelordTest', 'A3')
		const promises = [doc1, doc2, doc3].map(docRef => {
			setDoc(docRef, { ...generateRandomData(), ...uniqueValue })
		})
		await Promise.all(promises)
		const snapshot = await getCountFromServer(
			query(
				userRef.collection('FirelordTest'),
				where('name', '==', uniqueValue.name)
			)
		)
		expect(snapshot.data().count).toBe(3)
	})
})
