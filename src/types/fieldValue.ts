import { OriFieldValue } from './ori'

export const serverTimestampSymbol: unique symbol = Symbol()
export const deleteFieldSymbol: unique symbol = Symbol()
export const incrementSymbol: unique symbol = Symbol()
const possiblyReadAsUndefinedSymbol: unique symbol = Symbol()
export const arraySymbol: unique symbol = Symbol()

export interface FieldValue<T> {
	'Firelord.FieldValue': T
}
export interface ArrayFieldValue<T> {
	'Firelord.ArrayFieldValue': T
}
// PossiblyReadAsUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
export interface PossiblyReadAsUndefined {
	'Firelord.FieldValue': typeof possiblyReadAsUndefinedSymbol
}
export interface ServerTimestamp
	extends OriFieldValue,
		FieldValue<typeof serverTimestampSymbol> {}

// deleteField must appear at the top level of the data, however dot notation(update) is also considered as top level
export interface DeleteField
	extends OriFieldValue,
		FieldValue<typeof deleteFieldSymbol> {}

export interface Increment
	extends OriFieldValue,
		FieldValue<typeof incrementSymbol> {}
export interface ArrayUnionOrRemove<T>
	extends OriFieldValue,
		FieldValue<typeof arraySymbol>,
		ArrayFieldValue<T> {}

export type UnassignedAbleFieldValue = Increment | ArrayUnionOrRemove<unknown>

export type FieldValues =
	| ServerTimestamp
	| UnassignedAbleFieldValue
	| DeleteField
