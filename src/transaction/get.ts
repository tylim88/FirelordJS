import { OriTransaction, Get, OriDocumentReference } from '../types'

export const getCreator =
	(transaction: OriTransaction): Get =>
	// @ts-expect-error
	async reference => {
		const ref = await transaction.get(
			reference as unknown as OriDocumentReference
		)
		return ref
	}
