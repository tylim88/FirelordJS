import {
	setDoc,
	getFirelord,
	getDoc,
	MetaTypeCreator,
	arrayUnion,
	deleteDoc,
} from 'firelordjs'

import { initializeApp } from 'firebase/app'

const env = process.env
const config = {
	projectId: env.PROJECT_ID,
}
initializeApp(config)

type User = MetaTypeCreator<
	{ name: string; a: string[] },
	'testPublished',
	string
>

const userRef = getFirelord<User>()('testPublished')

// ! add more test in future
describe('test published package', () => {
	it('setDoc', async () => {
		await setDoc(userRef.doc('abc'), {
			name: 'abc123',
			a: arrayUnion('123', 'xyz'),
		})
		const docSnap = await getDoc(userRef.doc('abc'))
		expect(docSnap.data()).toEqual({ name: 'abc123', a: ['123', 'xyz'] })
		await deleteDoc(userRef.doc('abc'))
	})
})
