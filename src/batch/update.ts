import { OriWriteBatch, WriteBatchUpdate } from '../types'
import { flatten } from '../utils'

export const updateCreator =
	(writeBatch: OriWriteBatch): WriteBatchUpdate =>
	// @ts-expect-error
	(reference, data) => {
		return writeBatch.update(
			// @ts-expect-error
			reference,
			flatten(data)
		)
	}
