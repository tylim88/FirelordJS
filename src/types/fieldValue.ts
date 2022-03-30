// PossiblyUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
export interface PossiblyReadAsUndefined {
	'Firelord.FieldValue': 'PossiblyUndefined'
}
export interface ServerTimestamp {
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

export type FieldValues =
	| ServerTimestamp
	| UnassignedAbleFieldValue
	| DeleteField
