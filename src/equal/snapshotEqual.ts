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
	// ! DocumentSnapshot<User> does not extends DocumentSnapshot<MetaTypes>...why? same case with QuerySnapshot
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	left: DocumentSnapshot<any> | QuerySnapshot<any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	right: DocumentSnapshot<any> | QuerySnapshot<any>
) => {
	return snapshotEqual_(
		// @ts-expect-error
		left as DocumentSnapshot<MetaTypes>,
		right as DocumentSnapshot<MetaTypes>
	)
}
