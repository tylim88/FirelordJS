import {
	OriTransaction,
	OriDocumentReference,
	TransactionUpdate,
} from '../types'
import { flatten } from '../utils'

export const updateCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference, data: Record<string, unknown>) => {
		return transaction.update(
			reference,
			flatten(data) as Record<string, undefined>
		) as unknown
	}) as TransactionUpdate
