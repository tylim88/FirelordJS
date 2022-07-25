import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'

export interface DocumentReference<T extends MetaType> {
	/** The type of this Firestore reference. */
	readonly type: 'document'
	/**
	 * The {@link Firestore} instance the document is in.
	 * This is useful for performing transactions, for example.
	 */
	readonly firestore: Firestore
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

export interface CollectionReference<T extends MetaType> extends Query<T> {
	/** The type of this Firestore reference. */
	readonly type: 'collection'
	/** The collection's identifier. */
	get id(): T['docID']
	/**
	 * A string representing the path of the referenced collection (relative
	 * to the root of the database).
	 */
	get path(): T['docPath']
	/**
	 * A reference to the containing `DocumentReference` if this is a
	 * subcollection. If this isn't a subcollection, the reference is null.
	 */
	get parent(): T['parent']
}

// Query<T> is needed in order to infer the type correctly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Query<T extends MetaType> {
	/** The type of this Firestore reference. */
	readonly type: 'query' | 'collection'
	/**
	 * The `Firestore` instance for the Firestore database (useful for performing
	 * transactions, etc.).
	 */
	readonly firestore: Firestore
}
