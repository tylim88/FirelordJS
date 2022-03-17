import {
	FirelordFirestore,
	TransactionDelete,
	DocumentReference,
	MetaTypes,
} from '../types'

export const deleteCreator = ((transaction: FirelordFirestore.Transaction) =>
	(reference: DocumentReference<MetaTypes>) => {
		const ref = transaction.delete(
			reference as FirelordFirestore.DocumentReference
		)
		return ref
	}) as unknown as (
	transaction: FirelordFirestore.Transaction
) => TransactionDelete
