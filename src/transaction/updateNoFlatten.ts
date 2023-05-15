import { OriTransaction, TransactionUpdateNoFlatten } from '../types'

export const updateNoFlattenCreator =
	(transaction: OriTransaction): TransactionUpdateNoFlatten =>
	// @ts-expect-error
	(reference, data) => {
		return transaction.update(
			// @ts-expect-error
			reference,
			data as Record<string, undefined>
		)
	}
