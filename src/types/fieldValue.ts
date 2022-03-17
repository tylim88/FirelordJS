// PossiblyUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
export interface PossiblyReadAsUndefinedFieldValue {
	'Firelord.FieldValue': 'PossiblyUndefined'
}
export type ServerTimestampFieldValue = {
	'Firelord.FieldValue': 'ServerTimestampFieldValue'
}
// deleteField must appear at the top level of the data, however dot notation(update) is also considered as top level
export interface DeleteAbleFieldValue {
	'Firelord.FieldValue': 'DeleteAbleFieldValue'
}
export interface NumberFieldValue {
	'Firelord.FieldValue': 'Increment'
}
export interface ArrayFieldValue<T = unknown> {
	'Firelord.ArrayFieldValue': T
}

export type UnassignedAbleFieldValue = NumberFieldValue | ArrayFieldValue

// do not use string for Field Value, or else field with string type can accept them without problem
// this not a big issue, but able assigning field value to string member may raise question and confusion
export type FieldValues =
	| ServerTimestampFieldValue
	| UnassignedAbleFieldValue
	| DeleteAbleFieldValue
