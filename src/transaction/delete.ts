import {
	FirelordFirestore,
	TransactionDelete,
	DocumentReference,
	MetaType,
} from '../types'

export const deleteCreator = ((transaction: FirelordFirestore.Transaction) =>
	(reference: DocumentReference<MetaType>) => {
		const ref = transaction.delete(
			reference as FirelordFirestore.DocumentReference
		)
		return ref
	}) as unknown as (
	transaction: FirelordFirestore.Transaction
) => TransactionDelete
