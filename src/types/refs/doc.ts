import { CollectionReference } from './collection'
import { MetaType } from '../metaTypeCreator'
import { Firestore, Firestore_ } from '../alias'
import { GetOddOrEvenSegments } from '../utils'
import { IsValidDocIDLoop } from '../validID'
import { ErrorAutoIdTypeMustBeWideString } from '../error'

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */
export interface DocumentReference<T extends MetaType> {
	/** The type of this Firestore reference. */
	readonly type: 'document'
	/**
	 * The {@link Firestore_} instance the document is in.
	 * This is useful for performing transactions, for example.
	 */
	readonly firestore: Firestore_
	/**
	 * The document's identifier within its collection.
	 */
	get id(): T['docID']
	/**
	 * A string representing the path of the referenced document (relative
	 * to the root of the database).
	 */
	get path(): T['docPath']
	/**
	 * The collection this `DocumentReference` belongs to.
	 */
	get parent(): CollectionReference<T>
}

export type DocCreator = <T extends MetaType>(
	fStore: Firestore,
	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], true>
) => Doc<T>

export type Doc<T extends MetaType> = {
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this document path.
	 * @returns The `DocumentReference` instance.
	 */
	<D extends GetOddOrEvenSegments<T['docPath'], false>>(
		...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
	): DocumentReference<T>
	(
		CollectionReference: string extends T['docID']
			? CollectionReference<T>
			: ErrorAutoIdTypeMustBeWideString<T['docID']>
	): DocumentReference<T>
}

export type GetDocIds<T extends MetaType> = GetOddOrEvenSegments<
	T['docPath'],
	false
>
