import { FirelordFirestore, WriteBatchDelete } from '../types'

export const deleteCreator = ((writeBatch: FirelordFirestore.WriteBatch) =>
	(reference: FirelordFirestore.DocumentReference) => {
		const ref = writeBatch.delete(reference)
		return ref
	}) as unknown as (
	writeBatch: FirelordFirestore.WriteBatch
) => WriteBatchDelete
