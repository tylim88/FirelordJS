import { getDocs, getDocsFromCache, getDocsFromServer } from './getDocs'
import {
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc } from './setDoc'
import {
	IsSame,
	IsTrue,
	QuerySnapshot,
	QueryDocumentSnapshot,
	Query,
	DocumentReference,
} from '../types'
import { query } from '../refs'
import { where } from '../queryClauses'
import { snapshotEqual, queryEqual, refEqual } from '../equal'

initializeApp()
const queryTest = async (
	q: Query<User>,
	docId: string,
	data: User['write'],
	docRef: DocumentReference<User>
) => {
	await setDoc(docRef, data)

	// normal =====================
	const querySnapshot = await getDocs(q)
	type A = typeof querySnapshot
	type B = QuerySnapshot<User>
	IsTrue<IsSame<B, A>>()
	const queryDocumentSnapshot = querySnapshot.docs.filter(
		doc => doc.id === docId
	)[0]
	expect(queryDocumentSnapshot).not.toBe(undefined)
	if (queryDocumentSnapshot) {
		type X = typeof queryDocumentSnapshot
		type Y = QueryDocumentSnapshot<User>
		IsTrue<IsSame<X, Y>>()
		await compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
	}
	// ====================== normal

	// cache =========================
	const querySnapshotCache = await getDocsFromCache(q)
	type X = typeof querySnapshotCache
	type Y = QuerySnapshot<User>
	IsTrue<IsSame<X, Y>>()
	const queryDocumentSnapshotCache = querySnapshotCache.docs.filter(
		doc => doc.id === docId
	)[0]
	// https://stackoverflow.com/questions/70315073/firestore-web-version-9-modular-getdocsfromcache-seems-not-working
	// persistence are disable by default for web
	// cannot enable persistence without browser indexedDB
	// unable to test with cache
	expect(queryDocumentSnapshotCache).toBe(undefined)
	// ====================== cache

	// server ========================
	const querySnapshotServer = await getDocsFromServer(q)
	type E = typeof querySnapshotServer
	type F = QuerySnapshot<User>
	IsTrue<IsSame<E, F>>()
	const queryDocumentSnapshotServer = querySnapshotServer.docs.filter(
		doc => doc.id === docId
	)[0]
	expect(queryDocumentSnapshotServer).not.toBe(undefined)
	if (queryDocumentSnapshotServer) {
		type X = typeof queryDocumentSnapshotServer
		type Y = QueryDocumentSnapshot<User>
		IsTrue<IsSame<X, Y>>()
		await compareWriteDataWithDocSnapData(data, queryDocumentSnapshotServer)
	}
	// ====================== server

	// snapshotEqual =====================
	expect(snapshotEqual(querySnapshotCache, querySnapshotCache)).toBe(true)
	expect(snapshotEqual(querySnapshotServer, querySnapshotServer)).toBe(true)
	expect(snapshotEqual(querySnapshot, querySnapshot)).toBe(true)
	// expect(snapshotEqual(querySnapshot, querySnapshotServer)).toBe(true) // ! sometime true sometime false, why?
	expect(snapshotEqual(querySnapshotCache, querySnapshotServer)).toBe(false)
	expect(snapshotEqual(querySnapshotCache, querySnapshot)).toBe(false)
	// =====================snapshotEqual

	const incorrectDocRef = userRefCreator().doc('FirelordTest', 'abc')

	// refEqual =====================
	expect(refEqual(queryDocumentSnapshot!.ref, docRef)).toBe(true)
	expect(refEqual(queryDocumentSnapshotServer!.ref, docRef)).toBe(true)
	expect(refEqual(queryDocumentSnapshot!.ref, incorrectDocRef)).toBe(false)
	expect(refEqual(queryDocumentSnapshotServer!.ref, incorrectDocRef)).toBe(
		false
	)
	// ===================== refEqual

	// queryEqual =====================
	expect(queryEqual(queryDocumentSnapshot!.ref.parent, docRef.parent)).toBe(
		true
	)
	expect(
		queryEqual(queryDocumentSnapshotServer!.ref.parent, docRef.parent)
	).toBe(true)
	expect(
		queryEqual(queryDocumentSnapshot!.ref.parent, incorrectDocRef.parent)
	).toBe(true)
	expect(
		queryEqual(queryDocumentSnapshotServer!.ref.parent, incorrectDocRef.parent)
	).toBe(true)
	// ===================== queryEqual
}

describe('test getDocs', () => {
	it('test naked query functionality and type', async () => {
		const docId = 'getDocsNakedQueryTest'
		const docRef = userRefCreator().doc('FirelordTest', docId)
		const data = generateRandomData()
		const q = query(userRefCreator().collection('FirelordTest'))
		await queryTest(q, docId, data, docRef)
	})

	it('test query functionality and type with clause', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRefCreator().doc('FirelordTest', docId)
		const data = generateRandomData()
		const q = query(
			userRefCreator().collection('FirelordTest'),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(q, docId, data, docRef)
	})

	it('test collection group', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRefCreator().doc('FirelordTest', docId)
		const data = generateRandomData()
		const q = query(
			userRefCreator().collectionGroup(),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(q, docId, data, docRef)
	})

	it('test empty array with ( in ) filter', async () => {
		const arr: number[] = []
		const q = query(
			userRefCreator().collectionGroup(),
			where('a.b.c', 'in', arr)
		)
		const querySnap = await getDocs(q)
		expect(querySnap.docs.length).toBe(0)
	})

	it('test empty array with ( not-in ) filter', async () => {
		const arr: number[] = []
		const q = query(
			userRefCreator().collectionGroup(),
			where('a.b.c', 'not-in', arr)
		)
		const querySnap = await getDocs(q)
		expect(querySnap.docs.length).not.toBe(0)
	})

	it('test empty array with ( array-contains-any ) filter', async () => {
		const arr: string[] = []
		const q = query(
			userRefCreator().collectionGroup(),
			where('a.e', 'array-contains-any', arr)
		)
		const querySnap = await getDocs(q)
		expect(querySnap.docs.length).toBe(0)
	})

	it('test without query', async () => {
		const querySnap = await getDocs(userRefCreator().collection('FirelordTest'))
		IsTrue<IsSame<typeof querySnap, QuerySnapshot<User>>>()
		expect(querySnap.docs.length).not.toBe(0)
	})

	it('test without query collection group', async () => {
		const querySnap = await getDocs(userRefCreator().collectionGroup())
		IsTrue<IsSame<typeof querySnap, QuerySnapshot<User>>>()
		expect(querySnap.docs.length).not.toBe(0)
	})
})
