import { RulesTestContext } from '@firebase/rules-unit-testing'

export type OriFirestore = ReturnType<OriFirebaseFirestore['getFirestore']> // ! OriFirebaseFirestore['Firestore'] doesn't work even though they are the exact same type???

export type OriFirestoreTesting = ReturnType<RulesTestContext['firestore']>

export type OriFirebaseFirestore = typeof import('firebase/firestore')

export type OriDocumentData = import('firebase/firestore').DocumentData

export type OriSetOptions = import('firebase/firestore').SetOptions

export type OriFirestoreError = import('firebase/firestore').FirestoreError

export type OriSnapshotOptions = import('firebase/firestore').SnapshotOptions

export type OriSnapshotMetadata = import('firebase/firestore').SnapshotMetadata

export type OriQueryConstraint = import('firebase/firestore').QueryConstraint

export type OriSnapshotListenOptions =
	import('firebase/firestore').SnapshotListenOptions

export type OriUnsubscribe = import('firebase/firestore').Unsubscribe

export type OriDocumentReference<T extends OriDocumentData = OriDocumentData> =
	import('firebase/firestore').DocumentReference<T>

export type OriCollectionReference<
	T extends OriDocumentData = OriDocumentData
> = import('firebase/firestore').CollectionReference<T>

export type OriQuery<T extends OriDocumentData = OriDocumentData> =
	import('firebase/firestore').Query<T>

export type OriQuerySnapshot<T = OriDocumentData> =
	import('firebase/firestore').QuerySnapshot<T>

export type OriQueryDocumentSnapshot<T = OriDocumentData> =
	import('firebase/firestore').QueryDocumentSnapshot<T>

export type OriDocumentSnapshot<T extends OriDocumentData = OriDocumentData> =
	import('firebase/firestore').DocumentSnapshot<T>

export type OriDocumentChange<T = OriDocumentData> =
	import('firebase/firestore').DocumentChange<T>

export type OriDocumentChangeType =
	import('firebase/firestore').DocumentChangeType

export type OriWriteBatch = import('firebase/firestore').WriteBatch

export type OriTransaction = import('firebase/firestore').Transaction

export type OriOrderByDirection = 'asc' | 'desc'

export type OriWhereFilterOp = import('firebase/firestore').WhereFilterOp

export type OriGeoPoint = OriFirebaseFirestore['GeoPoint']

export type OriTimestamp = import('firebase/firestore').Timestamp
