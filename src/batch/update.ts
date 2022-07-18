import { OriWriteBatch, OriDocumentReference, WriteBatchUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator = (writeBatch: OriWriteBatch) =>
	((reference: OriDocumentReference, data: Record<string, unknown>) => {
		const ref = writeBatch.update(
			reference,
			// @ts-expect-error
			flatten(data)
		)
		return ref
	}) as WriteBatchUpdate
