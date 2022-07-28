import { getDocs, setDoc } from '../operations'
import { where } from '../queryClauses'
import {
	initializeApp,
	userRefCreator,
	generateRandomData,
} from '../utilForTests'
import { query } from './query'
import { documentId } from '../fieldPath'

initializeApp()
const docRef = userRefCreator().doc('testCollectionWithDocumentId')
const colRef = userRefCreator().collection()
const data = generateRandomData()
describe('test collection with documentId', () => {
	it(`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but 'topLevel/FirelordTest/Users/testCollectionWithDocumentId' contains a '/' character, positive test`, async () => {
		await setDoc(docRef, data)
		const snapshot = await getDocs(
			query(
				colRef,
				where(documentId(), '==', 'testCollectionWithDocumentId' as const)
			)
		)
		expect(snapshot.docs[0]?.data().age).toBe(data.age)
	})
	it(`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but 'topLevel/FirelordTest/Users/testCollectionWithDocumentId' contains a '/' character, negative test`, async () => {
		expect(() =>
			query(
				colRef,
				// @ts-expect-error
				where(documentId(), '==', docRef.path)
			)
		).toThrow()
	})
})
