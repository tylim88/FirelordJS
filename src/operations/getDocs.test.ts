import { getDocs } from './getDocs'
import {
	generateRandomData,
	compareReadAndWriteData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc } from '../operations'
import { IsSame, IsTrue, QuerySnapshot, QueryDocumentSnapshot } from '../types'
import { query } from '../refs'
import { where } from '../queryConstraints'

initializeApp()
const userRef = userRefCreator()
describe('test getDocs', () => {
	it('test naked query functionality and type', async () => {
		const docId = 'getDocsNakedQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		await setDoc(docRef, data)
		expect.hasAssertions()
		const querySnapshot = await getDocs(query(userRef.collection()))
		type A = typeof querySnapshot
		type B = QuerySnapshot<User>
		IsTrue<IsSame<B, A>>()
		const queryDocumentSnapshot = querySnapshot.docs.filter(
			doc => doc.id === docId
		)[0]
		expect(queryDocumentSnapshot).not.toBe(undefined)
		if (queryDocumentSnapshot) {
			type C = typeof queryDocumentSnapshot
			type D = QueryDocumentSnapshot<User>
			IsTrue<IsSame<C, D>>()
			await compareReadAndWriteData(data, queryDocumentSnapshot)
		}
	})

	it('test query functionality and type with options', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		await setDoc(docRef, data)
		expect.hasAssertions()
		const querySnapshot = await getDocs(
			query(userRef.collection(), where('a.b.c', '==', data.a.b.c as number))
		)
		type A = typeof querySnapshot
		type B = QuerySnapshot<User>
		IsTrue<IsSame<B, A>>()
		const queryDocumentSnapshot = querySnapshot.docs.filter(
			doc => doc.id === docId
		)[0]
		expect(querySnapshot.docs.length).toBe(1)
		expect(queryDocumentSnapshot).not.toBe(undefined)
		if (queryDocumentSnapshot) {
			type C = typeof queryDocumentSnapshot
			type D = QueryDocumentSnapshot<User>
			IsTrue<IsSame<C, D>>()
			await compareReadAndWriteData(data, queryDocumentSnapshot)
		}
	})

	it('test collection group', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		await setDoc(docRef, data)
		expect.hasAssertions()
		const querySnapshot = await getDocs(
			query(
				userRef.collectionGroup(),
				where('a.b.c', '==', data.a.b.c as number)
			)
		)
		type A = typeof querySnapshot
		type B = QuerySnapshot<User>
		IsTrue<IsSame<B, A>>()
		const queryDocumentSnapshot = querySnapshot.docs.filter(
			doc => doc.id === docId
		)[0]
		expect(querySnapshot.docs.length).toBe(1)
		expect(queryDocumentSnapshot).not.toBe(undefined)
		if (queryDocumentSnapshot) {
			type C = typeof queryDocumentSnapshot
			type D = QueryDocumentSnapshot<User>
			IsTrue<IsSame<C, D>>()
			await compareReadAndWriteData(data, queryDocumentSnapshot)
		}
	})
})
