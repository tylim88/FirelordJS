import { MetaType } from './metaTypeCreator'
import { FirelordFirestore } from './ori'
import {
	UnionReadServerTimestampWithNullFlatten,
	UnionReadServerTimestampWithNull,
} from './unionReadTimestampWithNull'
import { DocumentReference, Query } from './ref'

export interface DocumentSnapshot<T extends MetaType> {
	/**
	 *  Metadata about the `DocumentSnapshot`, including information about its
	 *  source and local modifications.
	 */
	readonly metadata: FirelordFirestore.OriSnapshotMetadata
	/**
	 * Returns whether or not the data exists. True if the document exists.
	 */
	exists(): boolean
	/**
	 * Retrieves all fields in the document as an `Object`. Returns `undefined` if
	 * the document doesn't exist.
	 *
	 * By default, `serverTimestamp()` values that have not yet been
	 * set to their final value will be returned as `null`. You can override
	 * this by passing an options object.
	 *
	 * @param options - An options object to configure how data is retrieved from
	 * the snapshot (for example the desired behavior for server timestamps that
	 * have not yet been set to their final value).
	 * @returns An `Object` containing all fields in the document or `undefined` if
	 * the document doesn't exist.
	 */
	data: <SnapshotOptions extends FirelordFirestore.OriSnapshotOptions = never>(
		options?: SnapshotOptions
	) => UnionReadServerTimestampWithNull<T, SnapshotOptions> | undefined
	/**
	 * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
	 * document or field doesn't exist.
	 *
	 * By default, a `serverTimestamp()` that has not yet been set to
	 * its final value will be returned as `null`. You can override this by
	 * passing an options object.
	 *
	 * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
	 * field.
	 * @param options - An options object to configure how the field is retrieved
	 * from the snapshot (for example the desired behavior for server timestamps
	 * that have not yet been set to their final value).
	 * @returns The data at the specified field location or undefined if no such
	 * field exists in the document.
	 */
	get<
		FieldPath extends keyof UnionReadServerTimestampWithNullFlatten<
			T,
			SnapshotOptions
		>,
		SnapshotOptions extends FirelordFirestore.OriSnapshotOptions = never
	>(
		fieldPath: FieldPath,
		options?: SnapshotOptions
	):
		| UnionReadServerTimestampWithNullFlatten<T, SnapshotOptions>[FieldPath]
		| undefined
	/**
	 * Property of the `DocumentSnapshot` that provides the document's ID.
	 */
	get id(): string
	/**
	 * The `DocumentReference` for the document included in the `DocumentSnapshot`.
	 */
	get ref(): DocumentReference<T>
}

export interface QuerySnapshot<T extends MetaType> {
	/**
	 * Metadata about this snapshot, concerning its source and if it has local
	 * modifications.
	 */
	readonly metadata: FirelordFirestore.OriSnapshotMetadata
	/**
	 * The query on which you called `get` or `onSnapshot` in order to get this
	 * `QuerySnapshot`.
	 */
	readonly query: Query<T>
	/** An array of all the documents in the `QuerySnapshot`. */
	get docs(): Array<QueryDocumentSnapshot<T>>
	/** The number of documents in the `QuerySnapshot`. */
	get size(): number
	/** True if there are no documents in the `QuerySnapshot`. */
	get empty(): boolean
	/**
	 * Enumerates all of the documents in the `QuerySnapshot`.
	 *
	 * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
	 * each document in the snapshot.
	 * @param thisArg - The `this` binding for the callback.
	 */
	forEach(
		callback: (result: QueryDocumentSnapshot<T>) => void,
		thisArg?: unknown
	): void
	/**
	 * Returns an array of the documents changes since the last snapshot. If this
	 * is the first snapshot, all documents will be in the list as 'added'
	 * changes.
	 *
	 * @param options - `SnapshotListenOptions` that control whether metadata-only
	 * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
	 * snapshot events.
	 */
	docChanges(
		options?: FirelordFirestore.OriSnapshotListenOptions
	): Array<DocumentChange<T>>
}

export interface QueryDocumentSnapshot<T extends MetaType>
	extends DocumentSnapshot<T> {
	/**
	 * Retrieves all fields in the document as an `Object`.
	 *
	 * By default, `serverTimestamp()` values that have not yet been
	 * set to their final value will be returned as `null`. You can override
	 * this by passing an options object.
	 *
	 * @override
	 * @param options - An options object to configure how data is retrieved from
	 * the snapshot (for example the desired behavior for server timestamps that
	 * have not yet been set to their final value).
	 * @returns An `Object` containing all fields in the document.
	 */
	data: <SnapshotOptions extends FirelordFirestore.OriSnapshotOptions = never>(
		options?: SnapshotOptions
	) => UnionReadServerTimestampWithNull<T, SnapshotOptions>
}

export interface DocumentChange<T extends MetaType> {
	/** The type of change ('added', 'modified', or 'removed'). */
	readonly type: FirelordFirestore.OriDocumentChangeType
	/** The document affected by this change. */
	readonly doc: QueryDocumentSnapshot<T>
	/**
	 * The index of the changed document in the result set immediately prior to
	 * this `DocumentChange` (i.e. supposing that all prior `DocumentChange` objects
	 * have been applied). Is `-1` for 'added' events.
	 */
	readonly oldIndex: number
	/**
	 * The index of the changed document in the result set immediately after
	 * this `DocumentChange` (i.e. supposing that all prior `DocumentChange`
	 * objects and the current `DocumentChange` object have been applied).
	 * Is -1 for 'removed' events.
	 */
	readonly newIndex: number
}
