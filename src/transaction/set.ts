import { FirelordFirestore, TransactionSet } from '../types'

export const setCreator = ((transaction: FirelordFirestore.OriTransaction) =>
	(
		reference: FirelordFirestore.OriDocumentReference,
		data: FirelordFirestore.OriDocumentData,
		options?: FirelordFirestore.OriSetOptions
	) => {
		const ref = options
			? transaction.set(reference, data, options)
			: transaction.set(reference, data)
		return ref
	}) as unknown as setCreator

type setCreator = (
	transaction: FirelordFirestore.OriTransaction
) => TransactionSet
