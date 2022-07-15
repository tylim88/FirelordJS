import { OriWriteBatch, OriDocumentReference, WriteBatchDelete } from '../types'

export const deleteCreator = ((writeBatch: OriWriteBatch) =>
	(reference: OriDocumentReference) => {
		const ref = writeBatch.delete(reference)
		return ref
	}) as unknown as (writeBatch: OriWriteBatch) => WriteBatchDelete
