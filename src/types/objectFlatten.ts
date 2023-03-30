export type DeepKey<
	T,
	Mode extends 'read' | 'write',
	K extends keyof T = keyof T
> = K extends string
	? T[K] extends infer R
		? R extends Record<string, unknown>
			? Mode extends 'write'
				? K | `${K}.${DeepKey<R, Mode>}`
				: `${K}.${DeepKey<R, Mode>}`
			: K
		: never // impossible route
	: never // impossible route

type DeepValue<
	T,
	P extends DeepKey<T, Mode>,
	Mode extends 'read' | 'write'
> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? T[K] extends infer S
			? S extends unknown
				? Rest extends DeepKey<S, Mode>
					? DeepValue<S, Rest, Mode>
					: never // impossible route
				: never // impossible route
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
