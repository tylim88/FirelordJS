import {
	OriFirestore,
	OriSnapshotMetadata,
	OriSnapshotOptions,
	OriSnapshotListenOptions,
	OriDocumentChangeType,
	OriFirestoreTesting,
	OriUnsubscribe,
	OriFirestoreError,
	OriDocumentData,
} from './ori'
export type Firestore = OriFirestore
export type FirestoreTesting = OriFirestoreTesting
export type FirestoreAndFirestoreTesting = Firestore | FirestoreTesting
export type SnapshotMetadata = OriSnapshotMetadata
export type SnapshotOptions = OriSnapshotOptions
export type SnapshotListenOptions = OriSnapshotListenOptions
export type DocumentChangeType = OriDocumentChangeType
export type Unsubscribe = OriUnsubscribe
export type FirestoreError = OriFirestoreError
export type DocumentData = OriDocumentData
