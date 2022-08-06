import { FieldValues } from './fieldValue'

type DeepKeyHybridInner<
	T,
	K extends keyof T,
	Mode extends 'read' | 'write'
> = K extends string
	? // ! this line is not needed because FieldValues does not extends Record<string, unknown>
	  // ! however removing it cause error in normal setDoc operation when dealing with array field value
	  // ! how is this possible as normal setDoc does not implement this check.
	  // ! it seems like it is inferring type from merge setDoc data type, need more research
	  T[K] extends FieldValues
		? K
		: T[K] extends Record<string, unknown>
		? Mode extends 'write'
			? K | `${K}.${DeepKeyHybridInner<T[K], keyof T[K], Mode>}`
			: `${K}.${DeepKeyHybridInner<T[K], keyof T[K], Mode>}`
		: K
	: never // impossible route

export type DeepKeyHybrid<
	T,
	Mode extends 'read' | 'write'
> = DeepKeyHybridInner<T, keyof T, Mode>

type DeepValueHybrid<
	T,
	P extends DeepKeyHybrid<T, Mode>,
	Mode extends 'read' | 'write'
> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? Rest extends DeepKeyHybrid<T[K], Mode>
			? DeepValueHybrid<T[K], Rest, Mode>
			: never // impossible route
		: never // impossible route
	: P extends keyof T
	? T[P]
	: never // impossible route

export type ObjectFlattenHybrid<Data> = Data extends Record<string, unknown>
	? {
			[K in DeepKeyHybrid<Data, 'write'>]-?: ObjectFlattenHybrid<
				DeepValueHybrid<Data, K, 'write'>
			>
	  }
	: Data

export type ObjectFlattenRead<Read extends Record<string, unknown>> = {
	[K in DeepKeyHybrid<Read, 'read'>]: DeepValueHybrid<Read, K, 'read'>
}
