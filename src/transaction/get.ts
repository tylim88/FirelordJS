import { FirelordFirestore, Get } from '../types'

export const getCreator =
	(transaction: FirelordFirestore.Transaction): Get =>
	// @ts-expect-error
	async reference => {
		const ref = await transaction.get(
			reference as unknown as FirelordFirestore.DocumentReference
		)
		return ref
	}
