import { OriTransaction, GetDoc } from '../types'

export const getCreator =
	(transaction: OriTransaction): GetDoc =>
	// @ts-expect-error
	reference => {
		return transaction.get(
			// @ts-expect-error
			reference
		)
	}
