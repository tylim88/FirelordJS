import { FirelordFirestore, WriteBatchSet } from '../types'

export const setCreator = ((writeBatch: FirelordFirestore.OriWriteBatch) =>
	(
		reference: FirelordFirestore.OriDocumentReference,
		data: FirelordFirestore.OriDocumentData,
		options?: FirelordFirestore.OriSetOptions
	) => {
		const ref = options
			? writeBatch.set(reference, data, options)
			: writeBatch.set(reference, data)
		return ref
	}) as unknown as setCreator

type setCreator = (writeBatch: FirelordFirestore.OriWriteBatch) => WriteBatchSet
