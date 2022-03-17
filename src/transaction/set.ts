import { FirelordFirestore, TransactionSet } from '../types'

export const setCreator = ((transaction: FirelordFirestore.Transaction) =>
	(
		reference: FirelordFirestore.DocumentReference,
		data: FirelordFirestore.DocumentData,
		options?: FirelordFirestore.SetOptions
	) => {
		const ref = options
			? transaction.set(reference, data, options)
			: transaction.set(reference, data)
		return ref
	}) as unknown as setCreator

type setCreator = (transaction: FirelordFirestore.Transaction) => TransactionSet
