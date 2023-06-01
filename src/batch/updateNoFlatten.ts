import { OriWriteBatch, WriteBatchUpdateNoFlatten } from '../types'

export const updateNoFlattenCreator =
	(writeBatch: OriWriteBatch): WriteBatchUpdateNoFlatten =>
	// @ts-expect-error
	(reference, data) => {
		return writeBatch.update(
			// @ts-expect-error
			reference,
			data
		)
	}
