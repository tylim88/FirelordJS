import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { GetOddOrEvenSegments } from '../utils'
import { IsValidDocIDLoop } from '../validID'
import { DocumentReference } from './doc'
import { Query } from './query'

/**
 * A {@link CollectionReference} object can be used for adding documents, getting
 * {@link DocumentReference}, and querying for documents (using {@link Query}).
 */
export interface CollectionReference<T extends MetaType> extends Query<T> {
	/** The type of this Firestore reference. */
	readonly type: 'collection'
	/** The collection's identifier. */
	get id(): T['collectionID']
	/**
	 * A string representing the path of the referenced collection (relative
	 * to the root of the database).
	 */
	get path(): T['collectionPath']
	/**
	 * A reference to the containing parent {@link DocumentReference} if this is a
	 * sub-collection. If this isn't a sub-collection, the reference is null.
	 */
	get parent(): T['parent'] extends MetaType
		? DocumentReference<T['parent']>
		: null
}

export type CollectionCreator = <T extends MetaType>(
	fStore: Firestore,
	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
) => Collection<T>

export type Collection<T extends MetaType> = {
	/**
	 * Gets a {@link CollectionReference} instance that refers to the collection at
	 * the specified absolute path.
	 *
	 *  related documentations:
	 *  - {@link https://firelordjs.com/guides/metatype child meta type}
	 *  - {@link https://firelordjs.com/quick_start#operations operation}
	 * @param documentIds
	 *  All the docID(s) needed to build this document path, eg
	 *  - for top-collection: example.collection()
	 *  - for sub-collection: example.collection(GrandParentDocId, ParentsDocId)
	 *
	 * @returns The {@link CollectionReference} instance.
	 */
	<D extends GetOddOrEvenSegments<T['collectionPath'], 'Even'>>(
		...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
	): CollectionReference<T>
}

export type GetCollectionIds<T extends MetaType> = GetOddOrEvenSegments<
	T['collectionPath'],
	'Even'
>
