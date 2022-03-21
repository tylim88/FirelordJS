import { getDocs, getDocsFromCache, getDocsFromServer } from './getDocs'
import {
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc } from '../operations'
import {
	IsSame,
	IsTrue,
	QuerySnapshot,
	QueryDocumentSnapshot,
	Query,
	DocumentReference,
} from '../types'
import { query } from '../refs'
import { where } from '../queryConstraints'

initializeApp()
const userRef = userRefCreator()
const queryTest = async (
	shareQuery: Query<User>,
	docId: string,
	data: User['write'],
	docRef: DocumentReference<User>
) => {
	await setDoc(docRef, data)
	expect.hasAssertions()
	const querySnapshot = await getDocs(shareQuery)
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
	// cache =========================
	// https://stackoverflow.com/questions/70315073/firestore-web-version-9-modular-getdocsfromcache-seems-not-working
	// persistence are disable by default for web
	// cannot enable persistence without browser indexedDB
	// unable to test with cache
	const querySnapshotCache = await getDocsFromCache(shareQuery)
	type X = typeof querySnapshotCache
	type Y = QuerySnapshot<User>
	IsTrue<IsSame<X, Y>>()
	const queryDocumentSnapshotCache = querySnapshotCache.docs.filter(
		doc => doc.id === docId
	)[0]
	expect(queryDocumentSnapshotCache).toBe(undefined)
	// server ========================
	const querySnapshotServer = await getDocsFromServer(shareQuery)
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
}
describe('test getDocs', () => {
	it('test naked query functionality and type', async () => {
		const docId = 'getDocsNakedQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		const shareQuery = query(userRef.collection())
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test query functionality and type with clause', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		const shareQuery = query(
			userRef.collection(),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test collection group', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		const shareQuery = query(
			userRef.collectionGroup(),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(shareQuery, docId, data, docRef)
	})
})
