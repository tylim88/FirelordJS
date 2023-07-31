import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { Query } from './query'

/**
 * A {@link CollectionGroup} refers to all documents that are contained in a
 * collection or sub-collection with a specific collection ID.
 */
export interface CollectionGroup<T extends MetaType> extends Query<T> {
	/** The type of this Firestore reference. */
	readonly type: 'query'
}

export type CollectionGroupCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionID: T['collectionID']
) => {
	(): CollectionGroup<T>
}
