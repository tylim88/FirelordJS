export namespace FirelordFirestore {
	export type Firestore = typeof import('firebase/compat/app').default.firestore

	export type FieldValue =
		import('firebase/compat/app').default.firestore.FieldValue

	export type DocumentData =
		import('firebase/compat/app').default.firestore.DocumentData

	export type DocumentReference<T extends DocumentData = DocumentData> =
		import('firebase/compat/app').default.firestore.DocumentReference<T>

	export type CollectionReference<T extends DocumentData = DocumentData> =
		import('firebase/compat/app').default.firestore.CollectionReference<T>

	export type CollectionGroup<T extends DocumentData = DocumentData> = Query<T>

	export type Query<T extends DocumentData = DocumentData> =
		import('firebase/compat/app').default.firestore.Query<T>

	export type DocumentSnapshot<T extends DocumentData = DocumentData> =
		import('firebase/compat/app').default.firestore.DocumentSnapshot<T>

	export type Transaction =
		import('firebase/compat/app').default.firestore.Transaction

	export type WriteBatch =
		import('firebase/compat/app').default.firestore.WriteBatch

	export type OrderByDirection = 'asc' | 'desc'

	export type WhereFilterOp =
		import('firebase/compat/app').default.firestore.WhereFilterOp

	export type GetOptions =
		import('firebase/compat/app').default.firestore.GetOptions

	export type GeoPoint = Firestore['GeoPoint']

	export type SnapshotListenOptions =
		import('firebase/compat/app').default.firestore.SnapshotListenOptions

	export type CreatedUpdatedWrite = {
		createdAt: FieldValue
		updatedAt: FieldValue
	}
	export type CreatedUpdatedCompare = {
		createdAt: Date | Timestamp
		updatedAt: Date | Timestamp
	}
	export type CreatedUpdatedRead = {
		createdAt: Timestamp
		updatedAt: Timestamp
	}

	export type Timestamp =
		import('firebase/compat/app').default.firestore.Timestamp
}
