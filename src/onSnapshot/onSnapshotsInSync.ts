import {
	onSnapshotsInSync as onSnapshotsInSync_,
	getFirestore,
} from 'firebase/firestore'
import { FirelordFirestore, IsTrue } from '../types'

const type = 'type' as const
// this will trigger error if firestore change the type definition
IsTrue<typeof type extends keyof FirelordFirestore.Firestore ? true : false>()

const firestore = 'firestore' as const
const firestoreLite = 'firestore-lite' as const
// this will trigger error if firestore change the type definition
IsTrue<

		| typeof firestore
		| typeof firestoreLite extends FirelordFirestore.Firestore[typeof type]
		? true
		: false
>()

const isFirestore = (
	arg:
		| ((error: FirelordFirestore.FirestoreError) => void)
		| (() => void)
		| FirelordFirestore.Firestore
		| undefined
): arg is FirelordFirestore.Firestore => {
	if (arg) {
		const argType = (arg as FirelordFirestore.Firestore).type
		// eslint-disable-next-line no-prototype-builtins
		return argType === firestore || argType === firestoreLite
	} else {
		return false
	}
}
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use `SnapshotMetadata` in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
 * is available.
 * @param onError - An optional callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur. You can shortcut {@link firestore} as argument here.
 * @param onCompletion - optional callback, but will not be called since streams are
 * never ending. You can shortcut {@link firestore} as argument here.
 * @param firestore - Optional. The `Firestore` instance for synchronizing snapshots. If no value is provided, default Firestore instance is used.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 */
export const onSnapshotsInSync = (
	onNext?: (value: void) => void | FirelordFirestore.Firestore,
	onError?: (
		error: FirelordFirestore.FirestoreError
	) => void | FirelordFirestore.Firestore,
	onCompletion?: () => void | FirelordFirestore.Firestore,
	firestore?: FirelordFirestore.Firestore
) => {
	const next = isFirestore(onNext) ? undefined : onNext
	const error = isFirestore(onError) ? undefined : onError
	const complete = isFirestore(onCompletion) ? undefined : onCompletion
	const fstore =
		firestore ||
		(isFirestore(next) ? next : undefined) ||
		(isFirestore(error) ? error : undefined) ||
		(isFirestore(onCompletion) ? onCompletion : undefined)
	return onSnapshotsInSync_(fstore || getFirestore(), {
		next,
		error,
		complete,
	})
}
