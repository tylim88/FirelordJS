import { Get } from './get'
import { TransactionSet } from './set'
import { TransactionUpdate } from './update'
import { TransactionDelete } from './delete'
import { Firestore } from './ori'

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

export type RunTransaction = {
	/** 
Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within the transaction has changed, Cloud Firestore retries the updateFunction. If it fails to commit after 5 attempts, the transaction fails.

The maximum number of writes allowed in a single transaction is 500.

@param firestore
A reference to the Firestore database to run this transaction against. If no value is provided.

@param updateFunction
The function to execute within the transaction context.

@returns
If the transaction completed successfully or was explicitly aborted (the updateFunction returned a failed promise), the promise returned by the updateFunction is returned here. Otherwise, if the transaction failed, a rejected promise with the corresponding failure error is returned.
*/
	<T>(
		firestore: Firestore,
		updateFunction: (transaction: Transaction) => Promise<T>
	): Promise<T>
	/** 
Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within the transaction has changed, Cloud Firestore retries the updateFunction. If it fails to commit after 5 attempts, the transaction fails.

The maximum number of writes allowed in a single transaction is 500.

@param updateFunction
The function to execute within the transaction context.

@returns
If the transaction completed successfully or was explicitly aborted (the updateFunction returned a failed promise), the promise returned by the updateFunction is returned here. Otherwise, if the transaction failed, a rejected promise with the corresponding failure error is returned.
*/
	<T>(updateFunction: (transaction: Transaction) => Promise<T>): Promise<T>
}
