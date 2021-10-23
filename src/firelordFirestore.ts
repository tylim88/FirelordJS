export namespace FirelordFirestore {
	export type firestore = typeof import('firebase').default.firestore

	export type FieldValue = import('firebase').default.firestore.FieldValue

	export type DocumentData = import('firebase').default.firestore.DocumentData

	export type DocumentReference<T extends DocumentData = DocumentData> =
		import('firebase').default.firestore.DocumentReference<T>

	export type CollectionReference<T extends DocumentData = DocumentData> =
		import('firebase').default.firestore.CollectionReference<T>

	export type CollectionGroup<T extends DocumentData = DocumentData> = Query<T>

	export type Query<T extends DocumentData = DocumentData> =
		import('firebase').default.firestore.Query<T>

	export type DocumentSnapshot<T extends DocumentData = DocumentData> =
		import('firebase').default.firestore.DocumentSnapshot<T>

	export type Transaction = import('firebase').default.firestore.Transaction

	export type WriteBatch = import('firebase').default.firestore.WriteBatch

	export type OrderByDirection = 'asc' | 'desc'

	export type WhereFilterOp = import('firebase').default.firestore.WhereFilterOp

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

	export type Timestamp = import('firebase').default.firestore.Timestamp
}
