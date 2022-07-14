import {
	OriWriteBatch,
	OriDocumentReference,
	OriDocumentData,
	OriSetOptions,
	WriteBatchSet,
} from '../types'

export const setCreator = ((writeBatch: OriWriteBatch) =>
	(
		reference: OriDocumentReference,
		data: OriDocumentData,
		options?: OriSetOptions
	) => {
		const ref = options
			? writeBatch.set(reference, data, options)
			: writeBatch.set(reference, data)
		return ref
	}) as unknown as setCreator

type setCreator = (writeBatch: OriWriteBatch) => WriteBatchSet
