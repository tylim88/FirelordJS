import {
	OriTransaction,
	OriDocumentReference,
	OriDocumentData,
	TransactionSet,
	OriSetOptions,
} from '../types'

export const setCreator = (transaction: OriTransaction) =>
	((
		reference: OriDocumentReference,
		data: OriDocumentData,
		options?: OriSetOptions
	) => {
		return (
			options
				? transaction.set(reference, data, options)
				: transaction.set(reference, data)
		) as unknown
	}) as TransactionSet
