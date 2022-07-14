import {
	FirelordFirestore,
	TransactionDelete,
	DocumentReference,
	MetaType,
} from '../types'

export const deleteCreator = ((transaction: FirelordFirestore.OriTransaction) =>
	(reference: DocumentReference<MetaType>) => {
		const ref = transaction.delete(
			reference as unknown as FirelordFirestore.OriDocumentReference
		)
		return ref
	}) as unknown as (
	transaction: FirelordFirestore.OriTransaction
) => TransactionDelete
