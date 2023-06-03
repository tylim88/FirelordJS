import {
	setDoc,
	updateDoc,
	deleteField,
	getFirelord,
	addDoc,
	deleteDoc,
	getDoc,
	getDocs,
	query,
	where,
	onSnapshot,
	runTransaction,
	writeBatch,
	getFirestore,
	connectFirestoreEmulator,
	getCountFromServer,
} from 'firelordjs'
import firebasejson from '../firebase.json'
import {
	User,
	readThenCompareWithWriteData,
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
} from './utilForTests'
import crypto from 'crypto'

initializeApp()
const port = firebasejson.emulators.firestore.port
const firestore = getFirestore()
connectFirestoreEmulator(firestore, firebasejson.emulators.firestore.host, port)
const userRef = getFirelord<User>(firestore, 'topLevel', 'Users')

describe('test whether works with emulator', () => {
	it('test updateDoc, setDoc, and delete field', async () => {
		const data = generateRandomData()
		const ref = userRef.doc(
			'FirelordTest',
			'updateDocEmulatorSpecificFieldTestCase'
		)
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await updateDoc(ref, {
			a: { 'i.j': deleteField() },
			'a.b': { f: arr },
			'a.b.c': num,
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await readThenCompareWithWriteData(data, ref)
	})
	it('test addDoc and deleteDoc', async () => {
		const data = generateRandomData()
		const ref = userRef.collection('FirelordTest')
		const docRef = await addDoc(ref, data)
		await readThenCompareWithWriteData(data, docRef)
		await deleteDoc(docRef)
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})

	it('test getDocs', async () => {
		const docId = 'getDocsEmulatorWithOptionsQueryTest'
		const docRef = userRef.doc('FirelordTest', docId)
		const data = generateRandomData()
		await setDoc(docRef, data)
		expect.hasAssertions()
		const querySnapshot = await getDocs(
			query(
				userRef.collectionGroup(),
				where('a.b.c', '==', data.a.b.c as number)
			)
		)
		const queryDocumentSnapshot = querySnapshot.docs.filter(
			doc => doc.id === docId
		)[0]
		expect(querySnapshot.docs.length).toBe(1)
		expect(queryDocumentSnapshot).not.toBe(undefined)
		if (queryDocumentSnapshot) {
			await compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
		}
	})

	it('test onSnapshot', () =>
		new Promise(done => {
			const docId = 'onSnapshotEmulatorWithOptionQueryTest'
			const docRef = userRef.doc('FirelordTest', docId)
			const data = generateRandomData()
			expect.hasAssertions()
			setDoc(docRef, data).then(() => {
				const unsub = onSnapshot(
					query(
						userRef.collection('FirelordTest'),
						where('a.b.c', '==', data.a.b.c as number)
					),
					async querySnapshot => {
						const queryDocumentSnapshot = querySnapshot.docs.filter(
							doc => doc.id === docId
						)[0]
						expect(querySnapshot.docs.length).toBe(1)
						expect(queryDocumentSnapshot).not.toBe(undefined)
						if (queryDocumentSnapshot) {
							await compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
						}
						unsub()
						done(1)
					},
					() => {
						//
					},
					{ includeMetadataChanges: true }
				)
			})
		}))
	it('test transaction, update, delete field', async () => {
		const data = generateRandomData()
		const ref = userRef.doc(
			'FirelordTest',
			'updateTransactionEmulatorSpecificFieldTestCase'
		)
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await runTransaction(async transaction => {
			await transaction.update(ref, {
				a: { 'i.j': deleteField() },
				'a.b': { f: arr },
				'a.b.c': num,
			})
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await readThenCompareWithWriteData(data, ref)
	})
	it('test transaction delete', async () => {
		const docRef = userRef.doc(
			'FirelordTest',
			'setTransactionEmulatorTestCaseRead'
		)
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(async transaction => {
			transaction.delete(docRef)
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})
	it('test transaction read functionality', async () => {
		const docRef = userRef.doc(
			'FirelordTest',
			'setTransactionEmulatorTestCaseRead'
		)
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(async transaction => {
			const docSnap = await transaction.get(docRef)
			compareWriteDataWithDocSnapData(data, docSnap)
		})
	})
	it('test batch update, delete field', async () => {
		const batch = writeBatch()
		const data = generateRandomData()
		const ref = userRef.doc(
			'FirelordTest',
			'updateBatchEmulatorSpecificFieldTestCase'
		)
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		batch.update(ref, {
			a: { 'i.j': deleteField() },
			'a.b': { f: arr },
			'a.b.c': num,
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await batch.commit()
		await readThenCompareWithWriteData(data, ref)
	})
	it('test batch delete functionality', async () => {
		const batch = writeBatch()
		const docRef = userRef.doc('FirelordTest', 'setBatchEmulatorTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		batch.delete(docRef)
		await batch.commit()
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists()).toBe(false)
	})
	it('test batch set functionality', async () => {
		const batch = writeBatch()
		const ref = userRef.doc('FirelordTest', 'setBatchEmulatorTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		batch.set(ref, { a: { b: { f: [] } } }, { mergeFields: ['a.b.f'] })
		await batch.commit()
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test auto generate id', () => {
		const ref = userRef.doc(userRef.collection('FirelordTest'))
		const splitPath = ref.path.split('/')
		expect(splitPath.length).toBe(4)
		expect(splitPath[splitPath.length - 1]!.length).toBe(20)
	})

	it('test aggregated count', async () => {
		const doc1 = userRef.doc('ForAggCountTest', '1')
		const doc2 = userRef.doc('ForAggCountTest', '2')
		const doc3 = userRef.doc('ForAggCountTest', '3')
		const doc4 = userRef.doc('ForAggCountTest', '4')
		const uniqueValue = { name: crypto.randomUUID() }
		const deletePromises = [doc1, doc2, doc3, doc4].map(docRef => {
			return deleteDoc(docRef)
		})

		await Promise.allSettled(deletePromises)
		const setPromises = [doc1, doc2, doc3].map(docRef => {
			return setDoc(docRef, { ...generateRandomData(), ...uniqueValue })
		})
		await setDoc(doc4, generateRandomData())
		await Promise.all(setPromises)

		const snapshot = await getCountFromServer(
			query(
				userRef.collection('ForAggCountTest'),
				where('name', '==', uniqueValue.name)
			)
		)
		expect(snapshot.data().count).toBe(3)

		const snapshot2 = await getCountFromServer(
			userRef.collection('ForAggCountTest')
		)
		expect(snapshot2.data().count).toBe(4)
	})
})
