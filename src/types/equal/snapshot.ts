import { DocumentSnapshot, QuerySnapshot } from '../snapshot'
import { MetaType } from '../metaTypeCreator'
export type SnapshotEqual = <
	T extends DocumentSnapshot<MetaType> | QuerySnapshot<MetaType>,
	U extends T
>(
	left: T,
	right: U
) => boolean
