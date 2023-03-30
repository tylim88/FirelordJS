import { OriTransaction, TransactionSet } from '../types'

export const setCreator =
	(transaction: OriTransaction): TransactionSet =>
	// @ts-expect-error
	(reference, data, options?) => {
		return transaction.set(
			// @ts-expect-error
			reference,
			data,
			options || {}
		)
	}
