import { RulesTestContext } from '@firebase/rules-unit-testing'

export type Firestore_ = ReturnType<FirebaseFirestore['getFirestore']> // ! OriFirebaseFirestore['Firestore'] doesn't work even though they are the exact same type???

export type FirestoreTesting = ReturnType<RulesTestContext['firestore']>

export type FirebaseFirestore = typeof import('firebase/firestore')

export type Firestore = Firestore_ | FirestoreTesting

export type DocumentData = import('firebase/firestore').DocumentData

export type OriSetOptions = import('firebase/firestore').SetOptions

export type FirestoreError = import('firebase/firestore').FirestoreError

export type SnapshotOptions = import('firebase/firestore').SnapshotOptions

export type SnapshotMetadata = import('firebase/firestore').SnapshotMetadata

export type QueryConstraint = import('firebase/firestore').QueryConstraint

export type SnapshotListenOptions =
	import('firebase/firestore').SnapshotListenOptions

export type Unsubscribe = import('firebase/firestore').Unsubscribe

export type DocumentChangeType = import('firebase/firestore').DocumentChangeType

export type OrderByDirection = import('firebase/firestore').OrderByDirection

export type WhereFilterOp = import('firebase/firestore').WhereFilterOp

export type GeoPoint = FirebaseFirestore['GeoPoint']

export type Timestamp = import('firebase/firestore').Timestamp

export type OriDocumentReference<T extends DocumentData = DocumentData> =
	import('firebase/firestore').DocumentReference<T>

export type OriCollectionReference<T extends DocumentData = DocumentData> =
	import('firebase/firestore').CollectionReference<T>

export type OriQuery<T extends DocumentData = DocumentData> =
	import('firebase/firestore').Query<T>

export type OriQuerySnapshot<T = DocumentData> =
	import('firebase/firestore').QuerySnapshot<T>

export type OriQueryDocumentSnapshot<T = DocumentData> =
	import('firebase/firestore').QueryDocumentSnapshot<T>

export type OriDocumentSnapshot<T extends DocumentData = DocumentData> =
	import('firebase/firestore').DocumentSnapshot<T>

export type OriDocumentChange<T = DocumentData> =
	import('firebase/firestore').DocumentChange<T>

export type OriWriteBatch = import('firebase/firestore').WriteBatch

export type OriTransaction = import('firebase/firestore').Transaction

export type OriFieldValue = import('firebase/firestore').FieldValue
