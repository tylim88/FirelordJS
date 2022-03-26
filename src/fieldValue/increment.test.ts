import { getFirelord } from '..'
import { setDoc, getDoc, updateDoc } from '../operations'
import { initializeApp } from '../utilForTests'
import { MetaTypeCreator } from '../types'
import { increment } from './increment'

initializeApp()
describe('test increment', () => {
	const ref =
		getFirelord<MetaTypeCreator<{ a: number }, 'increment', string>>()(
			'increment'
		)
	const docRef = ref.doc('increment')
	it('test with set', async () => {
		await setDoc(docRef, { a: -100 })
		await setDoc(docRef, { a: increment(100) })
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toBe(100)
		}
	})
	it('test with update ', async () => {
		await updateDoc(docRef, { a: increment(-100) })
		const docSnap2 = await getDoc(docRef)
		const data2 = docSnap2.data()
		expect(data2).not.toBe(undefined)
		if (data2) {
			expect(data2.a).toBe(0)
		}
	})
})
