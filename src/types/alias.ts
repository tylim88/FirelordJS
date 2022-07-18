import {
	OriFirestore,
	OriSnapshotMetadata,
	OriSnapshotOptions,
	OriSnapshotListenOptions,
	OriDocumentChangeType,
	OriFirestoreTesting,
} from './ori'
export type Firestore = OriFirestore
export type FirestoreTesting = OriFirestoreTesting
export type FirestoreAndFirestoreTesting = Firestore | FirestoreTesting
export type SnapshotMetadata = OriSnapshotMetadata
export type SnapshotOptions = OriSnapshotOptions
export type SnapshotListenOptions = OriSnapshotListenOptions
export type DocumentChangeType = OriDocumentChangeType
