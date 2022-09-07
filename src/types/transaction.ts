import { GetDoc } from './getDoc'
import { TransactionSet } from './set'
import { TransactionUpdate } from './update'
import { TransactionDelete } from './delete'
import { Firestore, TransactionOptions } from './alias'

/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
export interface Transaction {
	/**
	 * Reads the document referenced by the provided {@link DocumentReference}.
	 *
	 * @param documentRef - A reference to the document to be read.
	 * @returns A `DocumentSnapshot` with the read data.
	 */
	get: GetDoc
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

export type RunTransaction = {
	<T>(
		firestore: Firestore,
		updateFunction: (transaction: Transaction) => Promise<T>,
		options?: TransactionOptions
	): Promise<T>
	<T>(
		updateFunction: (transaction: Transaction) => Promise<T>,
		options?: TransactionOptions
	): Promise<T>
}
