import { snapshotEqual as snapshotEqual_ } from 'firebase/firestore'
import { DocumentSnapshot, QuerySnapshot, MetaType } from '../types'

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export const snapshotEqual = <
	// ! DocumentSnapshot<User> does not extends DocumentSnapshot<MetaType>...why? same case with QuerySnapshot
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends DocumentSnapshot<any> | QuerySnapshot<any>,
	U extends T
>(
	left: T,
	right: U
) => {
	return snapshotEqual_(
		// @ts-expect-error
		left as DocumentSnapshot<MetaType>,
		right as DocumentSnapshot<MetaType>
	)
}
