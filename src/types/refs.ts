import { MetaType } from './metaTypeCreator'
import { Firestore_ } from './alias'

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

// Query<T> is needed in order to infer the type correctly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Query<T extends MetaType> {
	/** The type of this Firestore reference. */
	readonly type: 'query' | 'collection'
	/**
	 * The `Firestore` instance for the Firestore database (useful for performing
	 * transactions, etc.).
	 */
	readonly firestore: Firestore_
}
