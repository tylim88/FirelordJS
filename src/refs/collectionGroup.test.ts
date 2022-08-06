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
const docRef = userRefCreator().doc('testCollectionGroupWithDocumentId')
const colGroupRef = userRefCreator().collectionGroup()
const data = generateRandomData()

describe('test collection with documentId', () => {
	it(`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but 'testCollectionWithDocumentId' is not because it has an odd number of segments (x), positive test`, async () => {
		await setDoc(docRef, data)
		const snapshot = await getDocs(
			query(colGroupRef, where(documentId(), '==', docRef.path))
		)
		expect(snapshot.docs[0]?.data().age).toBe(data.age)
	})
	it(`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but 'testCollectionWithDocumentId' is not because it has an odd number of segments (x), negative test`, async () => {
		expect(() =>
			query(
				colGroupRef,
				// @ts-expect-error
				where(documentId(), '==', 'testCollectionWithDocumentId' as const)
			)
		).toThrow()
	})
})
