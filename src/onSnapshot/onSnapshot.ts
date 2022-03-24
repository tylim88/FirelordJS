import { onSnapshot as onSnapshot_ } from 'firebase/firestore'
import {
	MetaType,
	Query,
	DocumentReference,
	FirelordFirestore,
	DocumentSnapshot,
	QuerySnapshot,
	IsTrue,
} from '../types'

const includeMetadataChanges = 'includeMetadataChanges' as const
// this will trigger error if firestore change the type definition
IsTrue<
	typeof includeMetadataChanges extends keyof FirelordFirestore.SnapshotListenOptions
		? true
		: false
>()

const isOptions = (
	arg:
		| ((error: FirelordFirestore.FirestoreError) => void)
		| (() => void)
		| FirelordFirestore.SnapshotListenOptions
		| undefined
): arg is FirelordFirestore.SnapshotListenOptions => {
	if (arg) {
		// eslint-disable-next-line no-prototype-builtins
		return arg.hasOwnProperty(includeMetadataChanges)
	} else {
		return false
	}
}

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
 * cancelled. No further callbacks will occur. You can shortcut {@link options} as argument here.
 * @param onCompletion - optional callback, but will not be called since streams are
 * never ending. You can shortcut {@link options} as argument here.
 * @param options - Options controlling the listen behavior.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export const onSnapshot = <
	T extends MetaType,
	Ref extends Query<T> | DocumentReference<T>
>(
	reference: Ref extends never ? Ref : Query<T> | DocumentReference<T>,
	onNext: (
		snapshot: Ref extends DocumentReference<T>
			? DocumentSnapshot<T>
			: QuerySnapshot<T>
	) => void,
	onError?:
		| ((error: FirelordFirestore.FirestoreError) => void)
		| FirelordFirestore.SnapshotListenOptions,
	onCompletion?: (() => void) | FirelordFirestore.SnapshotListenOptions,
	options?: FirelordFirestore.SnapshotListenOptions
) => {
	const newOnError = isOptions(onError) ? undefined : onError
	const newOncCompletion = isOptions(onCompletion) ? undefined : onCompletion
	const newOptions =
		options ||
		(isOptions(onError) ? onError : undefined) ||
		(isOptions(onCompletion) ? onCompletion : undefined)

	return newOptions
		? onSnapshot_(reference as FirelordFirestore.Query, newOptions, {
				// @ts-expect-error
				next: onNext,
				error: newOnError,
				complete: newOncCompletion,
		  })
		: onSnapshot_(
				reference as FirelordFirestore.Query,
				// @ts-expect-error
				onNext,
				newOnError,
				newOncCompletion
		  )
}
