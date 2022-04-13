import {
	initializeTestEnvironment,
	RulesTestContext,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
	setDoc,
	getFirelord,
	getDocs,
	query,
	where,
	onSnapshot,
	runTransaction,
	writeBatch,
	FirelordRef,
	MetaTypeCreator,
} from 'firelordjs'
import firebasejson from '../firebase.json'

const port = firebasejson.emulators.firestore.port

type User = MetaTypeCreator<{ name: string; age: number }, 'User', string>
let userRef = undefined as unknown as FirelordRef<User>
let testEnvFirestore = undefined as unknown as ReturnType<
	RulesTestContext['firestore']
>
let testEnv = undefined as unknown as RulesTestEnvironment

describe('test whether works with rules-unit-testing', () => {
	beforeAll(async () => {
		testEnv = await initializeTestEnvironment({
			projectId: 'any',
			firestore: { host: 'localhost', port },
		})
		await testEnv.clearFirestore()
		testEnvFirestore = testEnv
			.authenticatedContext('alice', {
				email: 'alice@example.com',
			})
			.firestore()
		userRef = getFirelord<User>(testEnvFirestore)('User')
	})
	afterAll(() => {
		testEnv.cleanup()
	})
	it('test basic operation like setDoc, updateDoc, addDoc, deleteDoc etc etc', async () => {
		const ref = userRef.doc('user1')
		await setDoc(ref, { age: 30, name: 'John' })
		// some other operations
		// do your assertion here...
	})
	it('test getDocs', async () => {
		const querySnapshot = await getDocs(
			query(
				userRef.collectionGroup(testEnvFirestore),
				where('name', '==', 'abc')
			)
		)
		// do your assertion here...
	})

	it('test onSnapshot', done => {
		expect.hasAssertions()

		const unsub = onSnapshot(
			query(userRef.collection(testEnvFirestore), where('age', '>', 10)),
			async querySnapshot => {
				// do your assertion here...
				unsub()
				done()
			}
		)
	})
	it('test transaction operations', async () => {
		await runTransaction(testEnvFirestore, async transaction => {
			await transaction.update(userRef.doc('user1'), {
				age: 20,
			})
			// some other operations
		})
		// do your assertion here...
	})

	it('test batch operations', async () => {
		const batch = writeBatch(testEnvFirestore)
		batch.delete(userRef.doc('user1'))
		// some other operations
		// do your assertion here...
	})
})
