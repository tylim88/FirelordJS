import { DocumentSnapshot, QuerySnapshot } from './snapshot'
import { MetaType } from './metaTypeCreator'
import { Query, DocumentReference } from './refs'
import { Unsubscribe, SnapshotListenOptions, FirestoreError } from './alias'

export type OnSnapshot = {
	<T extends MetaType>(
		reference: DocumentReference<T>,
		onNext: (snapshot: DocumentSnapshot<T>) => void,
		onError?: (error: FirestoreError) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
	<T extends MetaType>(
		reference: DocumentReference<T>,
		onNext: (snapshot: DocumentSnapshot<T>) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
	<T extends MetaType>(
		reference: Query<T>,
		onNext: (snapshot: QuerySnapshot<T>) => void,
		onError?: (error: FirestoreError) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
	<T extends MetaType>(
		reference: Query<T>,
		onNext: (snapshot: QuerySnapshot<T>) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
	<T extends MetaType>(
		reference: Query<T>,
		onNext: (snapshot: QuerySnapshot<T>) => void,
		onError?: (error: FirestoreError) => void,
		options?: SnapshotListenOptions
	): Unsubscribe
}
