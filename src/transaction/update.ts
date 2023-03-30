import { OriTransaction, TransactionUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator =
	(transaction: OriTransaction): TransactionUpdate =>
	// @ts-expect-error
	(reference, data) => {
		return transaction.update(
			// @ts-expect-error
			reference,
			flatten(data) as Record<string, undefined>
		)
	}
