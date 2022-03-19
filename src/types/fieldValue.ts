// PossiblyUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
export interface PossiblyReadAsUndefined {
	'Firelord.FieldValue': 'PossiblyUndefined'
}
export type ServerTimestamp = {
	'Firelord.FieldValue': 'ServerTimestamp'
}
// deleteField must appear at the top level of the data, however dot notation(update) is also considered as top level
export interface DeleteField {
	'Firelord.FieldValue': 'DeleteField'
}
export interface Increment {
	'Firelord.FieldValue': 'Increment'
}
export interface ArrayUnionOrRemove<T = unknown> {
	'Firelord.ArrayFieldValue': T
}

export type UnassignedAbleFieldValue = Increment | ArrayUnionOrRemove

// do not use string for Field Value, or else field with string type can accept them without problem
// this not a big issue, but able assigning field value to string member may raise question and confusion
export type FieldValues =
	| ServerTimestamp
	| UnassignedAbleFieldValue
	| DeleteField
