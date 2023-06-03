export type RemoveLastDot<T extends string> = T extends `${infer R}.` ? R : T

export type DeepKey<T, K extends keyof T = keyof T> = K extends string
	? T[K] extends infer R
		? R extends Record<string, unknown>
			? `${K}.` | `${K}.${DeepKey<R>}`
			: `${K}.`
		: never // impossible route
	: never // impossible route

export type DeepValue<
	T,
	P extends string
> = P extends `${infer K}.${infer Rest}`
	? T[K & keyof T] extends infer S
		? S extends S
			? DeepValue<S, Rest>
			: never // impossible route
		: never // impossible route
	: T[P & keyof T]

export type ObjectFlatten<Data> = Data extends Record<string, unknown>
	? {
			[K in DeepKey<Data> as RemoveLastDot<K>]-?: ObjectFlatten<
				DeepValue<Data, RemoveLastDot<K>>
			>
	  }
	: Data
