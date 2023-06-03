import { IsUnion } from './utils'
import { ErrorUnionInvolveObjectType } from './error'
import {
	FieldValues,
	PossiblyReadAsUndefined,
	DeleteField,
} from './fieldValues'

type ExtractObject<T> = Extract<T, Record<string, unknown>>

export type NoObjectUnion<T> = IsUnion<
	Exclude<T, PossiblyReadAsUndefined | DeleteField>
> extends true
	? ExtractObject<
			Exclude<T, PossiblyReadAsUndefined | DeleteField>
	  > extends never
		? T
		: ErrorUnionInvolveObjectType
	: T extends FieldValues
	? T
	: T extends Record<string, unknown>
	? {
			[K in keyof T]: NoObjectUnion<T[K]>
	  }
	: T
