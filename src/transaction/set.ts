import {
	OriTransaction,
	OriDocumentReference,
	OriDocumentData,
	TransactionSet,
	OriSetOptions,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'
export const setCreator = (transaction: OriTransaction) =>
	((
		reference: OriDocumentReference,
		data: OriDocumentData,
		options?: OriSetOptions
	) => {
		return transaction.set(
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		) as unknown
	}) as TransactionSet
