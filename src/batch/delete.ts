import { OriWriteBatch, OriDocumentReference, WriteBatchDelete } from '../types'

export const deleteCreator = (writeBatch: OriWriteBatch) =>
	((reference: OriDocumentReference) => {
		return writeBatch.delete(reference)
	}) as WriteBatchDelete
