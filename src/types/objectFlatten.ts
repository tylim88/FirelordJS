import { FieldValues } from './fieldValue'
import { NotTreatedAsObjectType } from './ref'

// https://javascript.plainenglish.io/using-firestore-with-more-typescript-8058b6a88674
type DeepKeyHybridInner<
	T,
	K extends keyof T,
	Mode extends 'read' | 'write'
> = K extends string
	? T[K] extends FieldValues | NotTreatedAsObjectType
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

export type ObjectFlattenHybrid<Data> = Data extends
	| FieldValues
	| NotTreatedAsObjectType // might not need to exclude FieldValues as it is interface now, but just leave it for now for safe
	? Data
	: Data extends Record<string, unknown>
	? {
			[K in DeepKeyHybrid<Data, 'write'>]-?: ObjectFlattenHybrid<
				DeepValueHybrid<Data, K, 'write'>
			>
	  }
	: Data

export type ObjectFlattenRead<Read extends Record<string, unknown>> = {
	[K in DeepKeyHybrid<Read, 'read'>]: DeepValueHybrid<Read, K, 'read'>
}
