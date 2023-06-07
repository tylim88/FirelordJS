import { IsUnion } from './utils'
import { ErrorUnionInvolveObjectType } from './error'
import { FieldValues, PossiblyReadAsUndefined, Delete } from './fieldValues'

type ExtractObject<T> = Extract<T, Record<string, unknown>>

export type NoObjectUnion<T> = IsUnion<
	Exclude<T, PossiblyReadAsUndefined | Delete>
> extends true
	? ExtractObject<Exclude<T, PossiblyReadAsUndefined | Delete>> extends never
		? T
		: ErrorUnionInvolveObjectType
	: T extends FieldValues
	? T
	: T extends Record<string, unknown>
	? {
			[K in keyof T]: NoObjectUnion<T[K]>
	  }
	: T
