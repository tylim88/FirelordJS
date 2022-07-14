import { FirelordFirestore, TransactionUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator = ((transaction: FirelordFirestore.OriTransaction) =>
	(
		reference: FirelordFirestore.OriDocumentReference,
		data: Record<string, unknown>
	) => {
		const ref = transaction.update(
			reference,
			// @ts-expect-error
			flatten(data)
		)
		return ref
	}) as unknown as (
	transaction: FirelordFirestore.OriTransaction
) => TransactionUpdate
