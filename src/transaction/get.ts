import { FirelordFirestore, Get } from '../types'

export const getCreator =
	(transaction: FirelordFirestore.OriTransaction): Get =>
	// @ts-expect-error
	async reference => {
		const ref = await transaction.get(
			reference as unknown as FirelordFirestore.OriDocumentReference
		)
		return ref
	}
