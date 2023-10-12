import { OriFieldValue } from './alias'
import { ErrorArrayFieldValueEmpty } from './error'
import { JSONServerTimestamp } from './json'

type ServerTimestampSymbol = 'Y$9aL#3pGvRiWt1*7cXzQ2h4OuPn0BdLxIe5mFy8'
type DeleteSymbol = '6Ks@MfVtRjDqYw7HlXvN2n1UgEzIx4bZo8yT3eCmA'
type IncrementSymbol = 'W#x7Lm5TzFhPdQr0JpS2OuGvY8c3A6XeNkVbIaRlE'
type PossiblyReadAsUndefinedSymbol = 'b#9RyFgA2KpWt7CzVn6D3UjOqLxPm5eH1s4IiYvXw'
type ArraySymbol = 'Z5TgNf$2O7mW9lLxIeS3KvQcXzPdJyRb0uA8h1VrY'

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

export type FieldValues =
	| ServerTimestamp
	| UnassignedAbleFieldValue
	| Delete
	| JSONServerTimestamp
