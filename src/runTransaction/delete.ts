import { OriTransaction, TransactionDelete } from '../types'

export const deleteCreator =
	(transaction: OriTransaction): TransactionDelete =>
	// @ts-expect-error
	reference => {
		return transaction.delete(
			// @ts-expect-error
			reference
		)
	}
