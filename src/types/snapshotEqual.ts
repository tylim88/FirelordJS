import { DocumentSnapshot, QuerySnapshot } from './snapshot'

export type SnapshotEqual = <
	T extends DocumentSnapshot<any> | QuerySnapshot<any>,
	U extends T
>(
	left: T,
	right: U
) => boolean
