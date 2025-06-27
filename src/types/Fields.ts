declare const serverTimestampSymbol: unique symbol
declare const deleteFieldSymbol: unique symbol
declare const incrementSymbol: unique symbol
declare const arraySymbol: unique symbol

type ServerTimestampSymbol = typeof serverTimestampSymbol
type DeleteSymbol = typeof deleteFieldSymbol
type IncrementSymbol = typeof incrementSymbol
type ArraySymbol = typeof arraySymbol

declare class FieldValue<T> {
	protected Firelord_FieldValue_Do_Not_Access: T
}
declare class ArrayFieldValue<T> {
	protected Firelord_ArrayFieldValue?: T
}

export interface ServerTimestamp extends FieldValue<ServerTimestampSymbol> {}

export interface Delete extends FieldValue<DeleteSymbol> {}

export interface Increment extends FieldValue<IncrementSymbol> {}
export interface ArrayUnionOrRemove<T>
	extends FieldValue<ArraySymbol>,
		ArrayFieldValue<T> {}

export type ArrayRemoveOrUnionFunction = <Elements extends unknown[]>(
	...elements: Elements extends [] ? ['Empty Array'] : Elements
) => ArrayUnionOrRemove<Elements[number]>

export type UnassignedAbleFieldValue = Increment | ArrayUnionOrRemove<unknown>

export type FieldValues = ServerTimestamp | UnassignedAbleFieldValue | Delete
