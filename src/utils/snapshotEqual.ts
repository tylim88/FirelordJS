import { snapshotEqual as snapshotEqual_ } from 'firebase/firestore'
import { DocumentSnapshot, QuerySnapshot, MetaTypes } from '../types'

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export const snapshotEqual = (
	left: DocumentSnapshot<MetaTypes> | QuerySnapshot<MetaTypes>,
	right: DocumentSnapshot<MetaTypes> | QuerySnapshot<MetaTypes>
) => {
	return snapshotEqual_(
		// @ts-expect-error
		left,
		right
	)
}
