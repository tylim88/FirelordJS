import { OriFieldValue } from './ori'
import {
	ServerTimestampSymbol,
	DeleteFieldSymbol,
	IncrementSymbol,
	PossiblyReadAsUndefinedSymbol,
	ArraySymbol,
} from './unique'

export declare class FieldValue<T> {
	protected constructor()
	protected 'Firelord.FieldValue': T
}
interface ArrayFieldValue<T> {
	'Firelord.ArrayFieldValue': T
}
// PossiblyReadAsUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PossiblyReadAsUndefined
	extends FieldValue<PossiblyReadAsUndefinedSymbol> {}

export interface ServerTimestamp
	extends OriFieldValue,
		FieldValue<ServerTimestampSymbol> {}

// deleteField must appear at the top level of the data, however dot notation(update) is also considered as top level
export interface DeleteField
	extends OriFieldValue,
		FieldValue<DeleteFieldSymbol> {}

export interface Increment extends OriFieldValue, FieldValue<IncrementSymbol> {}
export interface ArrayUnionOrRemove<T>
	extends OriFieldValue,
		FieldValue<ArraySymbol>,
		ArrayFieldValue<T> {}

export type UnassignedAbleFieldValue = Increment | ArrayUnionOrRemove<unknown>

export type FieldValues =
	| ServerTimestamp
	| UnassignedAbleFieldValue
	| DeleteField
