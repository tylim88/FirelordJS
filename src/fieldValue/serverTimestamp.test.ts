import { getFirelord } from '..'
import { setDoc, getDoc } from '../operations'
import { initializeApp } from '../utilForTests'
import { MetaTypeCreator, ServerTimestamp } from '../types'
import { serverTimestamp } from './serverTimestamp'

initializeApp()
describe('test serverTimestamp', () => {
	const ref =
		getFirelord<
			MetaTypeCreator<{ a: ServerTimestamp }, 'serverTimestamp', string>
		>()('serverTimestamp')
	const docRef = ref.doc('serverTimestamp')
	it('test with set', async () => {
		await setDoc(docRef, { a: serverTimestamp() })
		const docSnap = await getDoc(docRef)
		const data = docSnap.data()
		expect(typeof data?.a?.nanoseconds).toBe('number')
	})
})
