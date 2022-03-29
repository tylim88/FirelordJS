import { IsUnion } from './utils'
import { ErrorUnionInvolveObjectType } from './error'
import { FieldValues, PossiblyReadAsUndefined } from './fieldValue'

type FilterInNonObject<T> = Extract<T, Record<string, unknown>>

type ReplaceUnionInvolveObjectTypeWithErrorMsg<T> = IsUnion<
	Exclude<T, PossiblyReadAsUndefined>
> extends true
	? FilterInNonObject<Exclude<T, PossiblyReadAsUndefined>> extends never
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

type ExcludePossiblyUndefinedFieldValue<T> = Exclude<T, PossiblyReadAsUndefined>
// flatten need this because they need to exclude PossiblyUndefined for real in order to build correct path
export type RecursiveExcludePossiblyUndefinedFieldValue<T> = T extends Record<
	string,
	unknown
>
	? {
			[K in keyof T]: T[K] extends Record<string, unknown>
				? RecursiveExcludePossiblyUndefinedFieldValue<
						ExcludePossiblyUndefinedFieldValue<T[K]>
				  >
				: ExcludePossiblyUndefinedFieldValue<T[K]>
	  }
	: ExcludePossiblyUndefinedFieldValue<T>
