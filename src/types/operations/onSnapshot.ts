import { DocumentSnapshot, QuerySnapshot } from '../snapshot'
import { MetaType } from '../metaTypeCreator'
import {
	Query,
	DocumentReference,
	CollectionReference,
	CollectionGroup,
} from '../refs'
import { Unsubscribe, SnapshotListenOptions, FirestoreError } from '../alias'
import { ErrorOnSnapshotLastArg } from '../error'

type Reference<T extends MetaType> =
	| DocumentReference<T>
	| Query<T>
	| CollectionReference<T>

type ThirdArg = ((error: FirestoreError) => void) | SnapshotListenOptions

export type OnSnapshot = {
	/**
	 * listen to filtered collection, entire collection or single document
	 *
	 * Attaches a listener for {@link DocumentSnapshot} Or {@link QuerySnapshot} events. You may either pass
	 * individual {@link onNext} and {@link onError} callbacks. The listener can be cancelled by
	 * calling the function that is returned when {@link OnSnapshot} is called.
	 *
	 * related documentation:
	 *  - {@link https://firelordjs.com/quick_start#onsnapshot}
	 *
	 * @param reference
	 *
	 * Type 1: {@link Query} eg: query(example.collection(...), ...) listen to filtered collection
	 *
	 * Type 2: {@link CollectionGroup} eg: query(example.collectionGroup(...), ...) listen to filtered {@link Query}
	 *
	 * Type 3: {@link CollectionReference} eg: example.collection(...) listen to entire collection
	 *
	 * Type 4: {@link CollectionGroup} reference eg: example.collectionGroup(...) listen to entire {@link Query}
	 *
	 * Type 5: {@link DocumentReference} eg: example.doc(...) listen to a single document
	 * @param onNext - A callback to be called every time a new {@link DocumentSnapshot} or {@link QuerySnapshot} is available.
	 *
	 * Type 1: receive {@link DocumentSnapshot} if {@link reference} is {@link DocumentReference} eg: (value: {@link DocumentSnapshot}) => { handle data here }
	 *
	 * Type 2: receive {@link QuerySnapshot} if {@link reference} is {@link CollectionGroup} or {@link Query} or {@link CollectionReference} eg: (value: {@link QuerySnapshot}) => { handle data here }
	 *
	 * @param onError - optional parameter.
	 *
	 * Type 1: a callback to be called if the listen fails or is cancelled. No further callbacks will occur. Eg: (error: {@link FirestoreError})=> { handle error here}
	 *
	 * Type 2: {@link SnapshotListenOptions} eg: { includeMetadataChanges: boolean }
	 * @param options - optional parameter. If {@link onError} is {@link SnapshotListenOptions} eg: { includeMetadataChanges: boolean }, then this argument is never. Else it is {@link SnapshotListenOptions} eg: { includeMetadataChanges: boolean }
	 * @returns An unsubscribe function that can be called to cancel
	 * the snapshot listener.
	 */
	<T extends MetaType, Ref extends Reference<T>, Err extends ThirdArg>(
		reference: Ref extends never ? Ref : Reference<T>,
		onNext: (
			snapshot: Ref extends DocumentReference<T>
				? DocumentSnapshot<T>
				: QuerySnapshot<T>
		) => void | Promise<void>,
		onError?: Err extends never ? Err : ThirdArg,
		options?: Err extends (error: FirestoreError) => void | Promise<void>
			? SnapshotListenOptions
			: ErrorOnSnapshotLastArg
	): Unsubscribe
}

export type DummyOnSnapshot = CollectionGroup<MetaType>
