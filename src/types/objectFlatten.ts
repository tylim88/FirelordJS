export type RemoveLastDot<T extends string> = T extends `${infer R}.` ? R : T

export type DeepKey<T, DontFlatMap extends string> = keyof T extends infer K
	? string extends K & DontFlatMap
		? never
		: K extends string
		? T[K & keyof T] extends infer R
			? R extends Record<string, unknown>
				? `${K}.` | `${K}.${DeepKey<R, DontFlatMap>}`
				: `${K}.`
			: never // impossible route
		: never // impossible route
	: never // impossible route

export type DeepValue<T, P extends string> = T extends T
	? P extends `${infer K}.${infer Rest}`
		? T[K & keyof T] extends infer S
			? S extends S
				? DeepValue<S, Rest>
				: never // impossible route
			: never // impossible route
		: T[P & keyof T]
	: never // impossible route

export type ObjectFlatten<
	Data,
	DontFlatMap extends string
> = Data extends Record<string, unknown>
	? string extends keyof Data
		? Data extends Record<string, unknown>
			? Record<string, ObjectFlatten<Data[string], DontFlatMap>>
			: Data[string]
		: {
				[K in DeepKey<Data, string> as RemoveLastDot<K>]-?: ObjectFlatten<
					DeepValue<Data, RemoveLastDot<K>>,
					DontFlatMap
				>
		  }
	: Data
