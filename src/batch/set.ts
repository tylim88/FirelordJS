import { FirelordFirestore, WriteBatchSet } from '../types'

export const setCreator = ((writeBatch: FirelordFirestore.WriteBatch) =>
	(
		reference: FirelordFirestore.DocumentReference,
		data: FirelordFirestore.DocumentData,
		options?: FirelordFirestore.SetOptions
	) => {
		const ref = options
			? writeBatch.set(reference, data, options)
			: writeBatch.set(reference, data)
		return ref
	}) as unknown as setCreator

type setCreator = (writeBatch: FirelordFirestore.WriteBatch) => WriteBatchSet
