import { OriWriteBatch, WriteBatchSet } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const setCreator =
	(writeBatch: OriWriteBatch): WriteBatchSet =>
	// @ts-expect-error
	(reference, data, options?) => {
		return writeBatch.set(
			// @ts-expect-error
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		)
	}
