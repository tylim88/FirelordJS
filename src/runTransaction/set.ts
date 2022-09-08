import { OriTransaction, TransactionSet } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'
export const setCreator =
	(transaction: OriTransaction): TransactionSet =>
	// @ts-expect-error
	(reference, data, options?) => {
		return transaction.set(
			// @ts-expect-error
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		)
	}
