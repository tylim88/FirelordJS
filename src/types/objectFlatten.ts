import { FieldValues } from './fieldValue'

export type DeepKey<
	T,
	Mode extends 'read' | 'write',
	K extends keyof T = keyof T
> = K extends string
	? // ! this line is not needed because FieldValues does not extends Record<string, unknown>
	  // ! however removing it cause error in normal setDoc operation when dealing with array field value
	  // ! how is this possible as normal setDoc does not implement this check.
	  // ! it seems like it is inferring type from merge setDoc data type, need more research
	  T[K] extends FieldValues
		? K
		: T[K] extends Record<string, unknown>
		? Mode extends 'write'
			? K | `${K}.${DeepKey<T[K], Mode>}`
			: `${K}.${DeepKey<T[K], Mode>}`
		: K
	: never // impossible route

type DeepValue<
	T,
	P extends DeepKey<T, Mode>,
	Mode extends 'read' | 'write'
> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? Rest extends DeepKey<T[K], Mode>
			? DeepValue<T[K], Rest, Mode>
			: never // impossible route
		: never // impossible route
	: P extends keyof T
	? T[P]
	: never // impossible route

export type ObjectFlatten<Data> = Data extends Record<string, unknown>
	? {
			[K in DeepKey<Data, 'write'>]-?: ObjectFlatten<
				DeepValue<Data, K, 'write'>
			>
	  }
	: Data

export type ObjectFlattenShallow<Read extends Record<string, unknown>> = {
	[K in DeepKey<Read, 'read'>]: DeepValue<Read, K, 'read'>
}
