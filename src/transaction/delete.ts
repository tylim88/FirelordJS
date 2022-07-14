import {
	OriDocumentReference,
	OriTransaction,
	TransactionDelete,
	DocumentReference,
	MetaType,
} from '../types'

export const deleteCreator = ((transaction: OriTransaction) =>
	(reference: DocumentReference<MetaType>) => {
		const ref = transaction.delete(reference as unknown as OriDocumentReference)
		return ref
	}) as unknown as (transaction: OriTransaction) => TransactionDelete
