import { addDoc } from './addDoc'
import { deleteDoc } from './deleteDoc'
import { getDoc } from './getDoc'

import {
	userRef,
	initializeApp,
	generateRandomData,
	readThenCompareWithWriteData,
	User,
} from '../utilForTests'
import { IsSame, IsTrue, DocumentReference } from '../types'

initializeApp()
describe('test addDoc', () => {
	it('check return type', () => {
		;async () => {
			const docRef = await addDoc(
				userRef.collection('FirelordTest'),
				generateRandomData()
			)
			type A = typeof docRef
			type B = DocumentReference<User>
			IsTrue<IsSame<A, B>>()
		}
	})
	it('test wrong type', () => {
		;() =>
			addDoc(userRef.collection('FirelordTest'), {
				// @ts-expect-error
				beenTo: [{}],
				// @ts-expect-error
				name: true,
				// @ts-expect-error
				role: 'admi1n',
				// @ts-expect-error
				age: '3',
			})
	})
	it('test missing member', () => {
		;() =>
			// @ts-expect-error
			addDoc(userRef.collection(), {
				beenTo: [{ China: ['Guangdong'] }],
				name: 'abc',
				role: 'visitor',
			})
	})
	it('test functionality', async () => {
		const data = generateRandomData()
		const ref = userRef.collection('FirelordTest')
		const docRef = await addDoc(ref, data)
		await readThenCompareWithWriteData(data, docRef)
		await deleteDoc(docRef)
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})
})
