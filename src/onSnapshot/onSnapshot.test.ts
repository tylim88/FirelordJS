import { onSnapshot } from './onSnapshot'
import {
	generateRandomData,
	compareReadAndWriteData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc } from '../operations'
import {
	IsSame,
	IsTrue,
	DocumentSnapshot,
	QuerySnapshot,
	QueryDocumentSnapshot,
} from '../types'
import { query } from '../refs'
import { where } from '../queryConstraints'

initializeApp()
const userRef = userRefCreator()
describe('test onSnapshot', () => {
	it('test one doc functionality and type', done => {
		const docRef = userRef.doc('onSnapshotOneDocTest')
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(docRef, async documentSnapshot => {
				type A = typeof documentSnapshot
				type B = DocumentSnapshot<User>
				IsTrue<IsSame<B, A>>()
				await compareReadAndWriteData(data, documentSnapshot)
				unsub()
				done()
			})
		})
	})
	it('test one doc functionality and type with options', done => {
		const docRef = userRef.doc('onSnapshotWithOptionsOneDocTest')
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				docRef,
				async documentSnapshot => {
					type A = typeof documentSnapshot
					type B = DocumentSnapshot<User>
					IsTrue<IsSame<B, A>>()
					await compareReadAndWriteData(data, documentSnapshot)
					unsub()
					done()
				},
				{ includeMetadataChanges: true }
			)
		})
	})
	it('test naked query functionality and type', done => {
		const docId = 'onSnapshotNakedQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				query(userRef.collection()),
				async querySnapshot => {
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
					unsub()
					done()
				}
			)
		})
	})
	it('test query with option functionality and type', done => {
		const docId = 'onSnapshotWithOptionQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				query(userRef.collection(), where('a.b.c', '==', data.a.b.c as number)),
				async querySnapshot => {
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
					unsub()
					done()
				},
				{ includeMetadataChanges: false },
				{ includeMetadataChanges: true }
			)
		})
	})
})
