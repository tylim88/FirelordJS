import { FirelordFirestore, WriteBatchUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator = ((writeBatch: FirelordFirestore.WriteBatch) =>
	(
		reference: FirelordFirestore.DocumentReference,
		data: Record<string, unknown>
	) => {
		const ref = writeBatch.update(
			reference,
			// @ts-expect-error
			flatten(data)
		)
		return ref
	}) as unknown as (
	writeBatch: FirelordFirestore.WriteBatch
) => WriteBatchUpdate
