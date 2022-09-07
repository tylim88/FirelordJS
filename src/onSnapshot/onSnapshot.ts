import { onSnapshot as onSnapshot_ } from 'firebase/firestore'
import {
	FirestoreError,
	SnapshotListenOptions,
	OriQuery,
	OnSnapshot,
} from '../types'

export const isOptions = (
	arg:
		| ((error: FirestoreError) => void)
		| (() => void)
		| SnapshotListenOptions
		| undefined
): arg is SnapshotListenOptions => {
	const v = arg as Partial<SnapshotListenOptions>
	return v?.includeMetadataChanges !== undefined // includeMetadataChanges is boolean, so check for undefined
}

/**
 * listen to multiple documents or single document
 *
 * ======================================
 * listen to multiple documents
 * ======================================
 * Attaches a listener for `QuerySnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param onNext - A callback to be called every time a new `QuerySnapshot`
 * is available.
 * @param onError - optional and skippable(function overloading), a callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur.
 * @param options - optional, options controlling the listen behavior.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 *
 * ======================================
 * listen to a single document
 * ======================================
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
 * @param onError - optional and skippable(function overloading), a callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur.
 * @param options - optional, an options controlling the listen behavior.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export const onSnapshot: OnSnapshot = (
	reference,
	onNext,
	onError?,
	options?
) => {
	const newOnError = isOptions(onError) ? undefined : onError
	const newOptions = isOptions(onError) ? onError : options || {}

	return onSnapshot_(reference as OriQuery, newOptions, {
		// @ts-expect-error
		next: onNext,
		error: newOnError,
	})
}
