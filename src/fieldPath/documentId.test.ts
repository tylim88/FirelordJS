import { documentId } from './documentId'
import { DocumentId, IsTrue, IsSame, DocumentReference } from '../types'
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
const fullDocPath = 'topLevel/FirelordTest/Users/a' as const
const incorrectFullDocPath = 'topLevel/FirelordTest/Use2rs/a' as const
const incorrectSlashDocPath = 'topLevel/FirelordTest/Users/a/b' as const
const docRef = userRefCreator().doc(
	'FirelordTest',
	'testCollectionWithDocumentId'
)
const data = generateRandomData()
// documentId is also tested in query for common test
describe('test document id type', () => {
	it('test return type', () => {
		type A = ReturnType<typeof documentId>
		type B = DocumentId
		IsTrue<IsSame<A, B>>()
	})

	it('test reject __name__ as direct input', () => {
		query(
			collectionGroupRef,
			where(
				// @ts-expect-error
				'__name__',
				'==',
				fullDocPath
			)
		)
		query(
			collectionRef,
			where(
				// @ts-expect-error
				'__name__',
				'!=',
				'a' as const
			)
		)
	})

	it('test correct input', () => {
		query(collectionGroupRef, where(documentId(), '==', fullDocPath))
		query(collectionRef, where(documentId(), '!=', 'a' as const))
		query(
			collectionGroupRef,
			where(documentId(), '==', userRef.doc('FirelordTest', 'abc'))
		)
		query(
			collectionRef,
			where(documentId(), '!=', userRef.doc('FirelordTest', 'abc'))
		)
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
				where(documentId(), '!=', 'a' as const) // collectionGroup need full path
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
				where(documentId(), '!=', 1 as const)
			)
		).toThrow()
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '!=', 'a1222/5444b/5435c/4353454c' as const)
			)
		).toThrow()
		expect(() =>
			query(
				collectionRef,
				// @ts-expect-error
				where(documentId(), '!=', 'a/b/c/d/e' as const)
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

	it('test warn if no const assertion and wont throw', () => {
		// do not expect throw here
		query(
			collectionGroupRef,
			// @ts-expect-error
			where(documentId(), '==', 'topLevel/FirelordTest/Users/a')
		)
		// @ts-expect-error
		query(collectionRef, where(documentId(), '!=', 'a'))
	})

	it(`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but 'topLevel/FirelordTest/Users/testCollectionWithDocumentId' contains a '/' character, positive test`, async () => {
		await setDoc(docRef, data)
		const snapshot = await getDocs(
			query(
				collectionRef,
				where(documentId(), '==', 'testCollectionWithDocumentId' as const)
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
		const docID = 'TestDocumentID' as const
		const data = generateRandomData()
		const docRef = userRef.doc('FirelordTest', docID)
		await setDoc(docRef, data)
		const query1 = query(collectionRef, where(documentId(), '==', docID))
		const query2 = query(
			collectionGroupRef,
			where(
				documentId(),
				'==',
				'topLevel/FirelordTest/Users/TestDocumentID' as const
			)
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
		const docID = 'TestDocumentIDWithDocRef' as const
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
