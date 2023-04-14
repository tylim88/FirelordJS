import { documentId } from './documentId'
import { __name__, IsTrue, IsSame, DocumentReference } from '../types'
import { query } from '../refs'
import { where } from '../queryClauses'
import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	compareWriteDataWithDocSnapData,
	Parent,
} from '../utilForTests'
import { setDoc, getDocs } from '../operations'
initializeApp()
const userRef = userRefCreator()
const collectionGroupRef = userRef.collectionGroup()
const collectionRef = userRef.collection('FirelordTest')
const fullDocPath = 'topLevel/FirelordTest/Users/a'
const incorrectFullDocPath = 'topLevel/FirelordTest/Use2rs/a'
const incorrectSlashDocPath = 'topLevel/FirelordTest/Users/a/b'
const docRef = userRefCreator().doc(
	'FirelordTest',
	'testCollectionWithDocumentId'
)
const data = generateRandomData()
// documentId common behavior is tested in query.test.ts
describe('test document id type', () => {
	it('test return type', () => {
		type A = ReturnType<typeof documentId>
		type B = __name__
		IsTrue<IsSame<A, B>>()

		expect(documentId()).toBe('__name__')
	})

	it('test __name__, positive test', async () => {
		await expect(
			getDocs(query(collectionGroupRef, where('__name__', '==', fullDocPath)))
		).resolves.not.toThrow()

		await expect(
			getDocs(query(collectionRef, where('__name__', '!=', 'a')))
		).resolves.not.toThrow()
	})

	it('test __name__, negative test', () => {
		expect(() =>
			query(
				collectionGroupRef,
				// @ts-expect-error
				where('__name__', '==', 'a')
			)
		).toThrow()

		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where('__name__', '!=', 'a/b')
			)
		)
	})

	it('test document id type is string', () => {
		query(
			collectionGroupRef,
			// @ts-expect-error
			where(documentId(), '==', fullDocPath as string)
		)
		query(collectionRef, where(documentId(), '!=', 'a' as string))
	})

	it('test correct input', async () => {
		await expect(
			getDocs(query(collectionGroupRef, where(documentId(), '==', fullDocPath)))
		).resolves.not.toThrow()

		await expect(
			getDocs(query(collectionRef, where(documentId(), '!=', 'a')))
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					collectionGroupRef,
					where(documentId(), '==', userRef.doc('FirelordTest', 'abc'))
				)
			)
		).resolves.not.toThrow()

		await expect(
			getDocs(
				query(
					collectionRef,
					where(documentId(), '!=', userRef.doc('FirelordTest', 'abc'))
				)
			)
		).resolves.not.toThrow()
	})

	it('test incorrect input (swap)', () => {
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '==', fullDocPath) // collection need only documentId
			)
		).toThrow()
		expect(() =>
			query(
				collectionGroupRef,
				// @ts-expect-error
				where(documentId(), '!=', 'a') // collectionGroup need full path
			)
		).toThrow()
	})

	it('test incorrect input', () => {
		query(
			collectionGroupRef, // @ts-expect-error
			where(
				documentId(),
				'==',
				userRef.doc(
					'FirelordTest',
					'abc'
				) as unknown as DocumentReference<Parent>
			)
		)
		query(
			collectionRef, // @ts-expect-error
			where(
				documentId(),
				'!=',
				userRef.doc(
					'FirelordTest',
					'abc'
				) as unknown as DocumentReference<Parent>
			)
		)
		query(
			collectionGroupRef,
			// @ts-expect-error
			where(documentId(), '==', incorrectFullDocPath)
		)
		expect(() =>
			query(
				collectionGroupRef,
				// @ts-expect-error
				where(documentId(), '!=', incorrectSlashDocPath)
			)
		).toThrow()
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '!=', 1)
			)
		).toThrow()
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '!=', 'a1222/5444b/5435c/4353454c')
			)
		).toThrow()
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '!=', 'a/b/c/d/e')
			)
		).toThrow()
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '!=', incorrectSlashDocPath)
			)
		).toThrow()
	})

	it(`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but 'topLevel/FirelordTest/Users/testCollectionWithDocumentId' contains a '/' character, positive test`, async () => {
		await setDoc(docRef, data)
		const snapshot = await getDocs(
			query(
				collectionRef,
				where(documentId(), '==', 'testCollectionWithDocumentId')
			)
		)
		expect(snapshot.docs[0]?.data().age).toBe(data.age)
	})
	it(`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but 'topLevel/FirelordTest/Users/testCollectionWithDocumentId' contains a '/' character, negative test`, async () => {
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '==', docRef.path)
			)
		).toThrow()
	})

	it('test functionality', async () => {
		const docID = 'TestDocumentID'
		const data = generateRandomData()
		const docRef = userRef.doc('FirelordTest', docID)
		await setDoc(docRef, data)
		const query1 = query(collectionRef, where(documentId(), '==', docID))
		const query2 = query(
			collectionGroupRef,
			where(documentId(), '==', 'topLevel/FirelordTest/Users/TestDocumentID')
		)
		const queryAndTest = async (query: typeof query1) => {
			const querySnapshot = await getDocs(query)
			const docSnapshot = querySnapshot.docs.filter(doc => doc.id === docID)[0]
			expect(docSnapshot).not.toBe(undefined)
			if (docSnapshot) {
				compareWriteDataWithDocSnapData(data, docSnapshot)
			}
		}
		await queryAndTest(query1)
		await queryAndTest(query2)
	})

	it('test functionality with document reference', async () => {
		const docID = 'TestDocumentIDWithDocRef'
		const data = generateRandomData()
		const docRef = userRef.doc('FirelordTest', docID)
		await setDoc(docRef, data)
		const query1 = query(collectionRef, where(documentId(), '==', docRef))
		const query2 = query(collectionGroupRef, where(documentId(), '==', docRef))
		const queryAndTest = async (query: typeof query1) => {
			const querySnapshot = await getDocs(query)
			const docSnapshot = querySnapshot.docs.filter(doc => doc.id === docID)[0]
			expect(docSnapshot).not.toBe(undefined)
			if (docSnapshot) {
				compareWriteDataWithDocSnapData(data, docSnapshot)
			}
		}
		await queryAndTest(query1)
		await queryAndTest(query2)
	})
})
