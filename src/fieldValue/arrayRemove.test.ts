import { getFirelord } from '..'
import { setDoc, getDoc, updateDoc } from '../operations'
import { initializeApp } from '../utilForTests'
import { MetaTypeCreator } from '../types'
import { arrayRemove } from './arrayRemove'

initializeApp()
describe('test arrayRemove', () => {
	const ref =
		getFirelord<MetaTypeCreator<{ a: number[] }, 'arrayRemove', string>>()(
			'arrayRemove'
		)
	const docRef = ref.doc('arrayRemove')
	it('test with set', async () => {
		await setDoc(docRef, { a: [-100, 100, 0] })
		await setDoc(docRef, { a: arrayRemove(100, -200) })
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toEqual([])
		}
	})
	it('test with update', async () => {
		await setDoc(docRef, { a: [-100, 100, 0] })
		await updateDoc(docRef, { a: arrayRemove(-100, 200) })
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toEqual([100, 0])
			expect(data.a).not.toEqual([0, 100])
		}
	})
	it('test with no arg', async () => {
		await updateDoc(docRef, {
			a:
				// @ts-expect-error
				arrayRemove(),
		})
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(data).not.toBe(undefined)
		if (data) {
			expect(data.a).toEqual([100, 0])
			expect(data.a).not.toEqual([0, 100])
		}
	})
})
