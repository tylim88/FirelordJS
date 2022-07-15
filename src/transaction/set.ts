import {
	OriTransaction,
	OriDocumentReference,
	OriDocumentData,
	TransactionSet,
	OriSetOptions,
} from '../types'

export const setCreator = ((transaction: OriTransaction) =>
	(
		reference: OriDocumentReference,
		data: OriDocumentData,
		options?: OriSetOptions
	) => {
		const ref = options
			? transaction.set(reference, data, options)
			: transaction.set(reference, data)
		return ref
	}) as unknown as setCreator

type setCreator = (transaction: OriTransaction) => TransactionSet
