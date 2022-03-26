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
const user = userRefCreator()
const refGroup = user.collectionGroup()
const ref = user.collection()
const fullDocPath = 'topLevel/FirelordTest/Users/a' as const
const incorrectFullDocPath = 'topLevel/FirelordTest/Use2rs/a' as const
const incorrectSlashDocPath = 'topLevel/FirelordTest/Users/a/b' as const

// documentId is also tested in query for common test
describe('test document id type', () => {
	it('test return type', () => {
		type A = ReturnType<typeof documentId>
		type B = DocumentId
		IsTrue<IsSame<A, B>>()
	})

	it('test reject __name__ as direct input', () => {
		query(
			refGroup,
			where(
				// @ts-expect-error
				'__name__',
				'==',
				fullDocPath
			)
		)
		query(
			ref,
			where(
				// @ts-expect-error
				'__name__',
				'!=',
				'a' as const
			)
		)
	})

	it('test correct input', () => {
		query(refGroup, where(documentId(), '==', fullDocPath))
		query(ref, where(documentId(), '!=', 'a' as const))
		query(refGroup, where(documentId(), '==', user.doc('abc')))
		query(ref, where(documentId(), '!=', user.doc('abc')))
	})

	it('test incorrect input (swap)', () => {
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '==', fullDocPath)
			)
		).toThrow()
		expect(() =>
			query(
				refGroup,
				// @ts-expect-error
				where(documentId(), '!=', 'a' as const)
			)
		).toThrow()
	})

	it('test incorrect input', () => {
		query(
			refGroup,
			// @ts-expect-error
			where(documentId(), '==', user.doc('abc') as DocumentReference<Parent>)
		)

		query(
			ref, // @ts-expect-error
			where(documentId(), '!=', user.doc('abc') as DocumentReference<Parent>)
		)

		query(
			refGroup,
			// @ts-expect-error
			where(documentId(), '==', incorrectFullDocPath)
		)
		expect(() =>
			query(
				refGroup,
				// @ts-expect-error
				where(documentId(), '!=', incorrectSlashDocPath)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '!=', 1 as const)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '!=', 'a1222/5444b/5435c/4353454c' as const)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '!=', 'a/b/c/d/e' as const)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '!=', incorrectSlashDocPath)
			)
		).toThrow()
	})

	it('test warn if no const assertion and wont throw', () => {
		// do not expect throw here
		query(
			refGroup,
			// @ts-expect-error
			where(documentId(), '==', 'topLevel/FirelordTest/Users/a')
		)
		// @ts-expect-error
		query(ref, where(documentId(), '!=', 'a'))
	})

	it('test functionality', async () => {
		const docID = 'TestDocumentID' as const
		const data = generateRandomData()
		const docRef = user.doc(docID)
		await setDoc(docRef, data)
		const query1 = query(ref, where(documentId(), '==', docID))
		const query2 = query(
			refGroup,
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
		const docRef = user.doc(docID) // as DocumentReference<Parent>
		await setDoc(docRef, data)
		const query1 = query(ref, where(documentId(), '==', docRef))
		const query2 = query(refGroup, where(documentId(), '==', docRef))
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
