import { FirelordFirestore, WriteBatchUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator = ((writeBatch: FirelordFirestore.OriWriteBatch) =>
	(
		reference: FirelordFirestore.OriDocumentReference,
		data: Record<string, unknown>
	) => {
		const ref = writeBatch.update(
			reference,
			// @ts-expect-error
			flatten(data)
		)
		return ref
	}) as unknown as (
	writeBatch: FirelordFirestore.OriWriteBatch
) => WriteBatchUpdate
