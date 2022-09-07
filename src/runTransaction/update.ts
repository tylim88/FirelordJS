import {
	OriTransaction,
	OriDocumentReference,
	TransactionUpdate,
} from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const updateCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference, data: Record<string, unknown>) => {
		return transaction.update(
			reference,
			flatten(removeFieldValueInhomogeneousProps(data)) as Record<
				string,
				undefined
			>
		) as unknown
	}) as TransactionUpdate
