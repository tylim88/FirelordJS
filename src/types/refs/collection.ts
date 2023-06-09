import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { GetOddOrEvenSegments } from '../utils'
import { IsValidDocIDLoop } from '../validID'
import { DocumentReference } from './doc'
import { Query } from './query'

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link query}).
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
	 * A reference to the containing `DocumentReference` if this is a
	 * subcollection. If this isn't a subcollection, the reference is null.
	 */
	get parent(): T['parent'] extends MetaType
		? DocumentReference<T['parent']>
		: null
}

export type CollectionCreator =
	/**
	 * Gets a `CollectionReference` instance that refers to the collection at
	 * the specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this collection path.
	 * @returns The `CollectionReference` instance.
	 */
	<T extends MetaType>(
		fStore: Firestore,
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
	) => Collection<T>

export type Collection<T extends MetaType> = <
	D extends GetOddOrEvenSegments<T['collectionPath'], 'Even'>
>(
	...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
) => CollectionReference<T>

export type GetCollectionIds<T extends MetaType> = GetOddOrEvenSegments<
	T['collectionPath'],
	'Even'
>
