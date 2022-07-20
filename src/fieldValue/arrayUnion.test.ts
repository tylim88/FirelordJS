import { getFirelord } from '..'
import { setDoc, getDoc, updateDoc } from '../operations'
import { initializeApp } from '../utilForTests'
import { MetaTypeCreator } from '../types'
import { arrayUnion } from './arrayUnion'

initializeApp()
describe('test arrayUnion', () => {
	const ref =
		getFirelord<MetaTypeCreator<{ a: number[] }, 'arrayUnion', string>>()(
			'arrayUnion'
		)
	const docRef = ref.doc('arrayUnion')
	it('test with set', async () => {
		await setDoc(docRef, { a: [-100] })
		await setDoc(docRef, { a: arrayUnion(100) })
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toEqual([100])
		}
	})
	it('test with update', async () => {
		await updateDoc(docRef, { a: arrayUnion(-100) })
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toEqual([100, -100])
			expect(data.a).not.toEqual([-100, 100])
		}
	})
	it('test with no arg', async () => {
		await updateDoc(docRef, {
			a:
				// @ts-expect-error
				arrayUnion(),
		})
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toEqual([100, -100])
			expect(data.a).not.toEqual([-100, 100])
		}
	})
})
