import { StrictExclude } from './utils'

type Fields =
	| 'string'
	| 'number'
	| 'date'
	| 'geo-point'
	| 'reference'
	| 'map'
	| 'record'
	| 'boolean'

type ConverterWrite<T> = T extends 'string'
	? string
	: T extends 'number'
		? number
		: never

export type Model<
	T extends Fields,
	U extends false | 'tuple' | 'array' = false,
> = {
	type: T
	required?: boolean | (() => ConverterWrite<T>)
	nullable?: boolean
	deletable?: boolean
	isArray?: U
} & (U extends 'array'
	? {}
	: T extends number
		? {
				increment?: 'allowed' | 'always' | 'never'
			}
		: T extends 'date'
			? {
					serverTimestamp?: 'allowed' | 'always' | 'never'
				}
			: {})
