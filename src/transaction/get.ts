import { OriTransaction, Get, OriDocumentReference } from '../types'

export const getCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference) => {
		return transaction.get(reference) as unknown
	}) as Get
