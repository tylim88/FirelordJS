import { documentId } from './documentId'
import { DocumentId, IsTrue, IsSame, Query } from '../types'
import { query } from '../refs'
import { where } from '../queryConstraints'
import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	compareWriteDataWithDocSnapData,
	User,
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
	it('test correct input', () => {
		query(refGroup, where(documentId(), '==', fullDocPath))
		query(ref, where(documentId(), '!=', 'a' as const))
		query(refGroup, where('__name__', '==', fullDocPath))
		query(ref, where('__name__', '!=', 'a' as const))
	})
	it('test incorrect input', () => {
		query(
			refGroup,
			// @ts-expect-error
			where(documentId(), '==', incorrectFullDocPath)
		)
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), '!=', 1 as const)
			)
		).toThrow()
		expect(() =>
			query(
				refGroup,
				// @ts-expect-error
				where('__name__', '==', incorrectSlashDocPath)
			)
		).toThrow()
		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where('__name__', '!=', 'a/a' as const)
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
		// @ts-expect-error
		query(refGroup, where('__name__', '==', 'topLevel/FirelordTest/Users/a'))
		// @ts-expect-error
		query(ref, where('__name__', '!=', 'a'))
	})

	it('test functionality', async () => {
		const docID = 'TestDocumentID' as const
		const data = generateRandomData()
		await setDoc(user.doc('TestDocumentID'), data)
		const query1 = query(ref, where('__name__', '==', docID))
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
})
