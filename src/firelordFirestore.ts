export namespace FirelordFirestore {
	export type FieldValue = import('firebase-admin').firestore.FieldValue
	export type CreatedUpdatedWrite = {
		createdAt: FieldValue
		updatedAt: FieldValue
	}
	export type CreatedUpdatedRead = {
		createdAt: Timestamp
		updatedAt: Timestamp
	}
	export type CreatedUpdatedCompare = {
		createdAt: Date | Timestamp
		updatedAt: Date | Timestamp
	}

	export type Timestamp = import('firebase-admin').firestore.Timestamp

	export type Compare = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
	export type ArrayCompare = 'array-contains' | 'in' | 'array-contains-any'
}
