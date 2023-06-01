import {
	WriteBatchSet,
	WriteBatchUpdate,
	WriteBatchUpdateNoFlatten,
	WriteBatchDelete,
} from './operations'

/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */
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
	updateNoFlatten: WriteBatchUpdateNoFlatten
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
