import { documentId } from './documentId'
import { DocumentId, IsTrue, IsSame } from '../types'
// document id is further tested with query, here we test return type only
describe('test document id type', () => {
	it('test return type', () => {
		type A = ReturnType<typeof documentId>
		type B = DocumentId
		IsTrue<IsSame<A, B>>()
	})
})
