import { IsUnion } from './utils'
import { ErrorUnionInvolveObjectType } from './error'
import { FieldValues, PossiblyReadAsUndefined, DeleteField } from './fieldValue'

type FilterInNonObject<T> = Extract<T, Record<string, unknown>>

type ReplaceUnionInvolveObjectTypeWithErrorMsg<T> = IsUnion<
	Exclude<T, PossiblyReadAsUndefined | DeleteField>
> extends true
	? FilterInNonObject<
			Exclude<T, PossiblyReadAsUndefined | DeleteField>
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
