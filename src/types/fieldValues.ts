import { OriFieldValue } from './alias'
import { ErrorArrayFieldValueEmpty } from './error'

declare const serverTimestampSymbol: unique symbol
declare const deleteFieldSymbol: unique symbol
declare const incrementSymbol: unique symbol
declare const possiblyReadAsUndefinedSymbol: unique symbol
declare const arraySymbol: unique symbol

type ServerTimestampSymbol = typeof serverTimestampSymbol
type DeleteSymbol = typeof deleteFieldSymbol
type IncrementSymbol = typeof incrementSymbol
type PossiblyReadAsUndefinedSymbol = typeof possiblyReadAsUndefinedSymbol
type ArraySymbol = typeof arraySymbol

declare class FieldValue<T> {
	protected 'Firelord_FieldValue_Do_Not_Access': T
}
declare class ArrayFieldValue<T> {
	protected Firelord_ArrayFieldValue?: T
}

// PossiblyReadAsUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
export interface PossiblyReadAsUndefined
	extends FieldValue<PossiblyReadAsUndefinedSymbol> {}

export interface ServerTimestamp
	extends OriFieldValue,
		FieldValue<ServerTimestampSymbol> {}

// deleteField must appear at the top level of the data
export interface Delete extends OriFieldValue, FieldValue<DeleteSymbol> {}

export interface Increment extends OriFieldValue, FieldValue<IncrementSymbol> {}
export interface ArrayUnionOrRemove<T>
	extends OriFieldValue,
		FieldValue<ArraySymbol>,
		ArrayFieldValue<T> {}

export type ArrayRemoveOrUnionFunction = <Elements extends unknown[]>(
	...elements: Elements extends [] ? [ErrorArrayFieldValueEmpty] : Elements
) => ArrayUnionOrRemove<Elements[number]>

export type UnassignedAbleFieldValue = Increment | ArrayUnionOrRemove<unknown>

export type FieldValues = ServerTimestamp | UnassignedAbleFieldValue | Delete
