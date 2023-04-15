import { DocumentSnapshot, QuerySnapshot } from './snapshot'

export type SnapshotEqual = <
	T extends DocumentSnapshot<any> | QuerySnapshot<any>, // * need to keep the `any` type
	U extends T
>(
	left: T,
	right: U
) => boolean
