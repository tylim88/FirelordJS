import {
	OriTransaction,
	OriDocumentReference,
	DocumentData,
	TransactionSet,
	OriSetOptions,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'
export const setCreator = (transaction: OriTransaction) =>
	((
		reference: OriDocumentReference,
		data: DocumentData,
		options?: OriSetOptions
	) => {
		return transaction.set(
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		) as unknown
	}) as TransactionSet
