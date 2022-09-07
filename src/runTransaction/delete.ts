import {
	OriDocumentReference,
	OriTransaction,
	TransactionDelete,
} from '../types'

export const deleteCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference) => {
		return transaction.delete(reference) as unknown
	}) as TransactionDelete
