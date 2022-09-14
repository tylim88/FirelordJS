import {
	setDoc,
	getFirelord,
	getDocs,
	query,
	where,
	onSnapshot,
	runTransaction,
	writeBatch,
	getFirestore,
	connectFirestoreEmulator,
	MetaTypeCreator,
} from 'firelordjs'
import { initializeApp } from 'firebase/app'
import firebasejson from '../../../firebase.json'

initializeApp({
	apiKey: 'AIza....', // Auth / General Use
	authDomain: 'YOUR_APP.firebaseapp.com', // Auth with popup/redirect
	databaseURL: 'https://YOUR_APP.firebaseio.com', // Realtime Database
	storageBucket: 'YOUR_APP.appspot.com', // Storage
	messagingSenderId: '123456789', // Cloud Messaging
})

type User = MetaTypeCreator<{ name: string; age: number }, 'User', string>
const port = firebasejson.emulators.firestore.port
const firestore = getFirestore()
connectFirestoreEmulator(firestore, 'localhost', port)
const userRef = getFirelord<User>(firestore, 'User')

describe('test whether works with emulator', () => {
	it('test basic operation like setDoc, updateDoc, addDoc, deleteDoc etc etc', async () => {
		const ref = userRef.doc('user1')
		await setDoc(ref, { age: 30, name: 'John' })
		// some other operations
		// do your assertion here...
	})
	it('test getDocs', async () => {
		const querySnapshot = await getDocs(
			query(userRef.collectionGroup(), where('name', '==', 'abc'))
		)
		// do your assertion here...
	})

	it('test onSnapshot', done => {
		expect.hasAssertions()

		const unsub = onSnapshot(
			query(userRef.collection(), where('age', '>', 10)),
			async querySnapshot => {
				// do your assertion here...
				unsub()
				done()
			}
		)
	})
	it('test transaction operations', async () => {
		await runTransaction(async transaction => {
			await transaction.update(userRef.doc('user1'), {
				age: 20,
			})
			// some other operations
		})
		// do your assertion here...
	})

	it('test batch operations', async () => {
		const batch = writeBatch()
		batch.delete(userRef.doc('user1'))
		// some other operations
		// do your assertion here...
	})
})
