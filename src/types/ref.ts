// ! ref type is not sharable across V8 and V9
// ! possibly problematic if firestore add new props

import { MetaTypes } from './metaTypeCreator'
import { FirelordFirestore } from './firelordFirestore'
import { Get } from './get'
import { TransactionSet, WriteBatchSet } from './set'
import { TransactionUpdate, WriteBatchUpdate } from './update'
import { TransactionDelete, WriteBatchDelete } from './delete'
export interface DocumentReference<T extends MetaTypes> {
	/** The type of this Firestore reference. */
	readonly type: 'document'
	/**
	 * The {@link Firestore} instance the document is in.
	 * This is useful for performing transactions, for example.
	 */
	readonly firestore: FirelordFirestore.Firestore
	/**
	 * The document's identifier within its collection.
	 */
	get id(): string
	/**
	 * A string representing the path of the referenced document (relative
	 * to the root of the database).
	 */
	get path(): string
	/**
	 * The collection this `DocumentReference` belongs to.
	 */
	get parent(): CollectionReference<T>
}

export interface CollectionReference<T extends MetaTypes> {
	/** The type of this Firestore reference. */
	readonly type: 'collection'
	/** The collection's identifier. */
	get id(): string
	/**
	 * A string representing the path of the referenced collection (relative
	 * to the root of the database).
	 */
	get path(): string
	/**
	 * A reference to the containing `DocumentReference` if this is a
	 * subcollection. If this isn't a subcollection, the reference is null.
	 */
	get parent(): DocumentReference<T> | null
}

export interface Query<T extends MetaTypes> {
	/** The type of this Firestore reference. */
	readonly type: 'query' | 'collection'
	/**
	 * The `Firestore` instance for the Firestore database (useful for performing
	 * transactions, etc.).
	 */
	readonly firestore: FirelordFirestore.Firestore
}

export interface Transaction {
	/**
	 * Reads the document referenced by the provided {@link DocumentReference}.
	 *
	 * @param documentRef - A reference to the document to be read.
	 * @returns A `DocumentSnapshot` with the read data.
	 */
	get: Get
	/**
	 * Writes to the document referred to by the provided {@link
	 * DocumentReference}. If the document does not exist yet, it will be created.
	 * If you provide `merge` or `mergeFields`, the provided data can be merged
	 * into an existing document.
	 *
	 * @param documentRef - A reference to the document to be set.
	 * @param data - An object of the fields and values for the document.
	 * @param options - An object to configure the set behavior.
	 * @throws Error - If the provided input is not a valid Firestore document.
	 * @returns This `Transaction` instance. Used for chaining method calls.
	 */
	set: TransactionSet
	/**
     * Updates fields in the document referred to by the provided {@link
		 * DocumentReference}. The update will fail if applied to a document that does
		 * not exist.
		 * 
		 * @param documentRef - A reference to the document to be updated.
		 * @param data - An object containing the fields and values with which to
	update the document. Fields can contain dots to reference nested fields
	within the document.
		 * @throws Error - If the provided input is not valid Firestore data.
		 * @returns This `Transaction` instance. Used for chaining method calls.
		 */
	update: TransactionUpdate
	/**
	 * Deletes the document referred to by the provided {@link DocumentReference}.
	 *
	 * @param documentRef - A reference to the document to be deleted.
	 * @returns This `Transaction` instance. Used for chaining method calls.
	 */
	delete: TransactionDelete
}

export interface WriteBatch {
	/**
	 * Writes to the document referred to by the provided {@link
	 * DocumentReference}. If the document does not exist yet, it will be created.
	 * If you provide `merge` or `mergeFields`, the provided data can be merged
	 * into an existing document.
	 *
	 * @param documentRef - A reference to the document to be set.
	 * @param data - An object of the fields and values for the document.
	 * @param options - An object to configure the set behavior.
	 * @throws Error - If the provided input is not a valid Firestore document.
	 * @returns This `WriteBatch` instance. Used for chaining method calls.
	 */
	set: WriteBatchSet
	/**
	 * Updates fields in the document referred to by the provided {@link
	 * DocumentReference}. The update will fail if applied to a document that does
	 * not exist.
	 *
	 * @param documentRef - A reference to the document to be updated.
	 * @param data - An object containing the fields and values with which to
	 * update the document. Fields can contain dots to reference nested fields
	 * within the document.
	 * @throws Error - If the provided input is not valid Firestore data.
	 * @returns This `WriteBatch` instance. Used for chaining method calls.
	 */
	update: WriteBatchUpdate
	/**
	 * Deletes the document referred to by the provided {@link DocumentReference}.
	 *
	 * @param documentRef - A reference to the document to be deleted.
	 * @returns This `WriteBatch` instance. Used for chaining method calls.
	 */
	delete: WriteBatchDelete
	/**
	 * Commits all of the writes in this write batch as a single atomic unit.
	 *
	 * The result of these writes will only be reflected in document reads that
	 * occur after the returned promise resolves. If the client is offline, the
	 * write fails. If you would like to see local modifications or buffer writes
	 * until the client is online, use the full Firestore SDK.
	 *
	 * @returns A `Promise` resolved once all of the writes in the batch have been
	 * successfully written to the backend as an atomic unit (note that it won't
	 * resolve while you're offline).
	 */
	commit(): Promise<void>
}

export type NotTreatedAsObjectType = DocumentReference<MetaTypes>
