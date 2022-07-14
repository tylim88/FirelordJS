import { FirelordFirestore, WriteBatchDelete } from '../types'

export const deleteCreator = ((writeBatch: FirelordFirestore.OriWriteBatch) =>
	(reference: FirelordFirestore.OriDocumentReference) => {
		const ref = writeBatch.delete(reference)
		return ref
	}) as unknown as (
	writeBatch: FirelordFirestore.OriWriteBatch
) => WriteBatchDelete
