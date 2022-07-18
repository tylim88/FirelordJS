import { refEqual as refEqual_ } from 'firebase/firestore'
import { DocumentReference, CollectionReference, MetaType } from '../types'

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export const refEqual = <
	T extends DocumentReference<MetaType> | CollectionReference<MetaType>,
	U extends T
>(
	left: T,
	right: U
) => {
	return refEqual_(
		// @ts-expect-error
		left,
		right
	)
}
