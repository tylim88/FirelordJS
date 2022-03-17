import { FirelordFirestore, TransactionUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator = ((transaction: FirelordFirestore.Transaction) =>
	(
		reference: FirelordFirestore.DocumentReference,
		data: Record<string, unknown>
	) => {
		const ref = transaction.update(
			reference,
			// @ts-expect-error
			flatten(data)
		)
		return ref
	}) as unknown as (
	transaction: FirelordFirestore.Transaction
) => TransactionUpdate
