import { OriTransaction, TransactionUpdate } from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const updateCreator =
	(transaction: OriTransaction): TransactionUpdate =>
	// @ts-expect-error
	(reference, data) => {
		return transaction.update(
			// @ts-expect-error
			reference,
			flatten(removeFieldValueInhomogeneousProps(data)) as Record<
				string,
				undefined
			>
		)
	}
