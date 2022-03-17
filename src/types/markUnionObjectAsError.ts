import { IsUnion } from './utils'
import { ErrorUnionInvolveObjectType } from './error'
import { FieldValues, PossiblyReadAsUndefinedFieldValue } from './fieldValue'
import { NotTreatedAsObjectType } from './ref'

// non map type union with or without field value or non map type will result in never, indicating this is not a map type union
// map type union with all other type will result in map type, indicating there is map type union
// map type union with nothing resulting in map type, which is not a desire outcome hence need check whether it is union type first with IsUnion
type FilterInNonFieldValueObject<T> = Exclude<
	Extract<T, Record<string, unknown>>,
	FieldValues | NotTreatedAsObjectType // might not need to exclude FieldValues as it is interface now, but just leave it for now for safe
>

type ReplaceUnionInvolveObjectTypeWithErrorMsg<T> = IsUnion<
	Exclude<T, PossiblyReadAsUndefinedFieldValue>
> extends true
	? FilterInNonFieldValueObject<
			Exclude<T, PossiblyReadAsUndefinedFieldValue>
	  > extends never
		? T
		: ErrorUnionInvolveObjectType
	: T extends FieldValues
	? T
	: T extends Record<string, unknown>
	? RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<T>
	: T

export type RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
	T extends Record<string, unknown>
> = {
	[K in keyof T]: ReplaceUnionInvolveObjectTypeWithErrorMsg<T[K]>
}

type ExcludePossiblyUndefinedFieldValue<T> = Exclude<
	T,
	PossiblyReadAsUndefinedFieldValue
>
// flatten need this because they need to exclude PossiblyUndefined for real in order to build correct path
export type RecursiveExcludePossiblyUndefinedFieldValue<T> = T extends
	| FieldValues
	| NotTreatedAsObjectType // might not need to exclude FieldValues as it is interface now, but just leave it for now for safe
	? T
	: T extends Record<string, unknown>
	? {
			[K in keyof T]: T[K] extends Record<string, unknown>
				? RecursiveExcludePossiblyUndefinedFieldValue<
						ExcludePossiblyUndefinedFieldValue<T[K]>
				  >
				: ExcludePossiblyUndefinedFieldValue<T[K]>
	  }
	: ExcludePossiblyUndefinedFieldValue<T>
