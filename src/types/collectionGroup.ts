import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { Query } from './refs'

export type CollectionGroupCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionID: T['collectionID']
) => () => Query<T>
