import { MetaType } from '../metaTypeCreator'
import { DocumentReference, CollectionReference } from '../refs'

export type RefEqual = <
	T extends DocumentReference<MetaType> | CollectionReference<MetaType>,
	U extends T
>(
	left: T,
	right: U
) => boolean
