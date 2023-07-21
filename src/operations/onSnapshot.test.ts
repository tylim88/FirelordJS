import { onSnapshot, isOptions } from './onSnapshot'
import {
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc, deleteDoc } from '../operations'
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
const docId1 = 'onSnapshotOneDocTest'
const docId2 = 'onSnapshotWithOptionsOneDocTest'
const docId3 = 'onSnapshotNakedQueryTest'
const docId4 = 'onSnapshotWithOptionQueryTest'
describe('test onSnapshot', () => {
	afterAll(async () => {
		await Promise.all([
			deleteDoc(userRefCreator().doc('FirelordTest', docId1)),
			deleteDoc(userRefCreator().doc('FirelordTest', docId2)),
			deleteDoc(userRefCreator().doc('FirelordTest', docId3)),
			deleteDoc(userRefCreator().doc('FirelordTest', docId4)),
		])
	})
	it('test isOption', () => {
		expect(isOptions({})).toBe(false)
		expect(isOptions({ includeMetadataChanges: false })).toBe(true)
		expect(isOptions({ includeMetadataChanges: true })).toBe(true)
	})
	it('test one doc functionality and type', () =>
		new Promise(done => {
			const docRef = userRefCreator().doc('FirelordTest', docId1)
			const data = generateRandomData()
			expect.hasAssertions()
			setDoc(docRef, data).then(() => {
				const unsub = onSnapshot(
					docRef,
					async documentSnapshot => {
						type A = typeof documentSnapshot
						type B = DocumentSnapshot<User>
						IsTrue<IsSame<B, A>>()
						compareWriteDataWithDocSnapData(data, documentSnapshot)
						unsub()
						done(1)
					},
					{ includeMetadataChanges: true }
				)
			})
		}))
	it('test one doc functionality and type', () =>
		new Promise(done => {
			const docRef = userRefCreator().doc('FirelordTest', docId2)
			const data = generateRandomData()
			expect.hasAssertions()
			setDoc(docRef, data).then(() => {
				const unsub = onSnapshot(
					docRef,
					async documentSnapshot => {
						type A = typeof documentSnapshot
						type B = DocumentSnapshot<User>
						IsTrue<IsSame<B, A>>()
						compareWriteDataWithDocSnapData(data, documentSnapshot)
						unsub()
						done(1)
					},
					() => {
						//
					}
				)
			})
		}))
	it('test naked query functionality and type with options', () =>
		new Promise(done => {
			const docRef = userRefCreator().doc('FirelordTest', docId3)
			const data = generateRandomData()
			expect.hasAssertions()
			setDoc(docRef, data).then(() => {
				const unsub = onSnapshot(
					query(userRefCreator().collection('FirelordTest')),
					async querySnapshot => {
						type A = typeof querySnapshot
						type B = QuerySnapshot<User>
						IsTrue<IsSame<B, A>>()
						const queryDocumentSnapshot = querySnapshot.docs.filter(
							doc => doc.id === docId3
						)[0]
						expect(queryDocumentSnapshot).not.toBe(undefined)
						if (queryDocumentSnapshot) {
							type C = typeof queryDocumentSnapshot
							type D = QueryDocumentSnapshot<User>
							IsTrue<IsSame<C, D>>()
							compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
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
	it('test query with option functionality and type', () =>
		new Promise(done => {
			const docRef = userRefCreator().doc('FirelordTest', docId4)
			const data = generateRandomData()
			expect.hasAssertions()
			setDoc(docRef, data).then(() => {
				const unsub = onSnapshot(
					query(
						userRefCreator().collection('FirelordTest'),
						where('a.b.c', '==', data.a.b.c as number)
					),
					async querySnapshot => {
						type A = typeof querySnapshot
						type B = QuerySnapshot<User>
						IsTrue<IsSame<B, A>>()
						const queryDocumentSnapshot = querySnapshot.docs.filter(
							doc => doc.id === docId4
						)[0]
						expect(querySnapshot.docs.length).toBe(1)
						expect(queryDocumentSnapshot).not.toBe(undefined)
						if (queryDocumentSnapshot) {
							type C = typeof queryDocumentSnapshot
							type D = QueryDocumentSnapshot<User>
							IsTrue<IsSame<C, D>>()
							compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
						}
						unsub()
						done(1)
					},
					{ includeMetadataChanges: true }
				)
			})
		}))

	it('test listen to entire collection', () =>
		new Promise(done => {
			const docRef = userRefCreator().doc('FirelordTest', docId3)
			const data = generateRandomData()
			expect.hasAssertions()
			setDoc(docRef, data).then(() => {
				const unsub = onSnapshot(
					userRefCreator().collection('FirelordTest'),
					async querySnapshot => {
						type A = typeof querySnapshot
						type B = QuerySnapshot<User>
						IsTrue<IsSame<B, A>>()
						const queryDocumentSnapshot = querySnapshot.docs.filter(
							doc => doc.id === docId3
						)[0]
						expect(queryDocumentSnapshot).not.toBe(undefined)
						if (queryDocumentSnapshot) {
							type C = typeof queryDocumentSnapshot
							type D = QueryDocumentSnapshot<User>
							IsTrue<IsSame<C, D>>()
							compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
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
})
