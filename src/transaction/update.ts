import {
	OriTransaction,
	OriDocumentReference,
	TransactionUpdate,
} from '../types'
import { flatten } from '../utils'

export const updateCreator = ((transaction: OriTransaction) =>
	(reference: OriDocumentReference, data: Record<string, unknown>) => {
		const ref = transaction.update(
			reference,
			// @ts-expect-error
			flatten(data)
		)
		return ref
	}) as unknown as (transaction: OriTransaction) => TransactionUpdate
