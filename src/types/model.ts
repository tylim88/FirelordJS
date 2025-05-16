import { StrictExclude } from './utils'

type Fields =
	| 'string'
	| 'number'
	| 'date'
	| 'geo-point'
	| 'reference'
	| 'array'
	| 'map'
	| 'record'

type ConverterWrite<T> = T extends 'string'
	? string
	: T extends 'number'
		? number
		: never

type Model<T extends Fields> = {
	type: T
	required?: boolean | (() => ConverterWrite<T>)
	nullable?: boolean
	deletable?: boolean
} & (T extends 'array'
	? {
			element: Model<Fields>
		}
	: T extends number
		? {
				increment?: 'allowed' | 'always' | 'never'
			}
		: T extends 'date'
			? {
					serverTimestamp?: 'allowed' | 'always' | 'never'
				}
			: {})
