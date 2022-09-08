import { OriWriteBatch, WriteBatchUpdate } from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const updateCreator =
	(writeBatch: OriWriteBatch): WriteBatchUpdate =>
	// @ts-expect-error
	(reference, data) => {
		return writeBatch.update(
			// @ts-expect-error
			reference,
			flatten(removeFieldValueInhomogeneousProps(data))
		)
	}
