import { OriWriteBatch, WriteBatchSet } from '../types'

export const setCreator =
	(writeBatch: OriWriteBatch): WriteBatchSet =>
	// @ts-expect-error
	(reference, data, options?) => {
		return writeBatch.set(
			// @ts-expect-error
			reference,
			data,
			options || {}
		)
	}
