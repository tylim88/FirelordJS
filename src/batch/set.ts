import {
	OriWriteBatch,
	OriDocumentReference,
	OriDocumentData,
	OriSetOptions,
	WriteBatchSet,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const setCreator = (writeBatch: OriWriteBatch) =>
	((
		reference: OriDocumentReference,
		data: OriDocumentData,
		options?: OriSetOptions
	) => {
		return writeBatch.set(
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		)
	}) as WriteBatchSet
