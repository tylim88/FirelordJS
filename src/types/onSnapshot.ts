import { DocumentSnapshot, QuerySnapshot } from './snapshot'
import { MetaType } from './metaTypeCreator'
import { Query, DocumentReference } from './refs'
import { Unsubscribe, SnapshotListenOptions, FirestoreError } from './alias'

export type OnSnapshot = {
	/**
	 * Attaches a listener for `DocumentSnapshot` events. You may either pass
	 * individual `onNext` and `onError` callbacks or pass a single observer
	 * object with `next` and `error` callbacks.
	 *
	 * NOTE: Although an `onCompletion` callback can be provided, it will
	 * never be called because the snapshot stream is never-ending.
	 *
	 * @param reference - A reference to the document to listen to.
	 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
	 * is available.
	 * @param onError - An optional callback to be called if the listen fails or is
	 * cancelled. No further callbacks will occur.
	 * @param options - Options controlling the listen behavior.
	 * @returns An unsubscribe function that can be called to cancel
	 * the snapshot listener.
	 */
	<T extends MetaType, Ref extends Query<T> | DocumentReference<T>>(
		reference: Ref extends never ? Ref : Query<T> | DocumentReference<T>,
		onNext: (
			snapshot: Ref extends DocumentReference<T>
				? DocumentSnapshot<T>
				: QuerySnapshot<T>
		) => void,
		onError?: (error: FirestoreError) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
	/**
	 * Attaches a listener for `DocumentSnapshot` events. You may either pass
	 * individual `onNext` and `onError` callbacks or pass a single observer
	 * object with `next` and `error` callbacks.
	 *
	 * NOTE: Although an `onCompletion` callback can be provided, it will
	 * never be called because the snapshot stream is never-ending.
	 *
	 * @param reference - A reference to the document to listen to.
	 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
	 * is available.
	 * @param options - Options controlling the listen behavior.
	 * @returns An unsubscribe function that can be called to cancel
	 * the snapshot listener.
	 */
	<T extends MetaType, Ref extends Query<T> | DocumentReference<T>>(
		reference: Ref extends never ? Ref : Query<T> | DocumentReference<T>,
		onNext: (
			snapshot: Ref extends DocumentReference<T>
				? DocumentSnapshot<T>
				: QuerySnapshot<T>
		) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
}
