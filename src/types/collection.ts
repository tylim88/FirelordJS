import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { CollectionReference } from './refs'

export type CollectionCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionPath: T['collectionPath']
) => (firestore?: Firestore) => CollectionReference<T>
