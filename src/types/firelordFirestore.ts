export namespace FirelordFirestore {
	export type Firestore = ReturnType<FirebaseFirestore['getFirestore']>

	export type FirebaseFirestore = typeof import('firebase/firestore')

	export type Doc = FirebaseFirestore['doc']

	export type Collection = FirebaseFirestore['collection']

	export type CollectionGroup = FirebaseFirestore['collectionGroup']

	export type SetDoc = FirebaseFirestore['setDoc']

	export type GetDoc = FirebaseFirestore['getDoc']

	export type AddDoc = FirebaseFirestore['addDoc']

	export type DeleteDoc = FirebaseFirestore['deleteDoc']

	export type UpdateDoc = FirebaseFirestore['updateDoc']

	export type RunTransaction = FirebaseFirestore['runTransaction']

	export type FieldValue = import('firebase/firestore').FieldValue

	export type DocumentData = import('firebase/firestore').DocumentData

	export type SetOptions = import('firebase/firestore').SetOptions

	export type FirestoreError = import('firebase/firestore').FirestoreError

	export type SnapshotOptions = import('firebase/firestore').SnapshotOptions

	export type SnapshotMetadata = import('firebase/firestore').SnapshotMetadata

	export type QueryConstraint = import('firebase/firestore').QueryConstraint

	export type SnapshotListenOptions =
		import('firebase/firestore').SnapshotListenOptions

	export type DocumentReference<T extends DocumentData = DocumentData> =
		import('firebase/firestore').DocumentReference<T>

	export type CollectionReference<T extends DocumentData = DocumentData> =
		import('firebase/firestore').CollectionReference<T>

	export type Query<T extends DocumentData = DocumentData> =
		import('firebase/firestore').Query<T>

	export type QuerySnapshot<T = DocumentData> =
		import('firebase/firestore').QuerySnapshot<T>

	export type QueryDocumentSnapshot<T = DocumentData> =
		import('firebase/firestore').QueryDocumentSnapshot<T>

	export type DocumentSnapshot<T extends DocumentData = DocumentData> =
		import('firebase/firestore').DocumentSnapshot<T>

	export type DocumentChange<T = DocumentData> =
		import('firebase/firestore').DocumentChange<T>

	export type DocumentChangeType =
		import('firebase/firestore').DocumentChangeType

	export type WriteBatch = import('firebase/firestore').WriteBatch

	export type Transaction = import('firebase/firestore').Transaction

	export type OrderByDirection = 'asc' | 'desc'

	export type WhereFilterOp = import('firebase/firestore').WhereFilterOp

	export type GeoPoint = FirebaseFirestore['GeoPoint']

	export type Timestamp = import('firebase/firestore').Timestamp
}
