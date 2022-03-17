import { addDoc } from './addDoc'
import { deleteDoc } from './deleteDoc'
import { getDoc } from './getDoc'

import {
	userRefCreator,
	initializeApp,
	writeThenReadTest,
} from '../utilForTests'
initializeApp()
const userRef = userRefCreator()
describe('test addDoc', () => {
	it('test wrong type', () => {
		;() =>
			addDoc(userRef.collection(), {
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
		await writeThenReadTest(async data => {
			const ref = userRef.collection()
			const docRef = await addDoc(ref, data)
			await deleteDoc(docRef)
			const docSnap = await getDoc(docRef)
			expect(docSnap.exists()).toBe(false)
			const docRef2 = await addDoc(ref, data)
			const docSnap2 = await getDoc(docRef2)
			expect(docSnap2.exists()).toBe(true)
			return docRef2
		})
	})
})
