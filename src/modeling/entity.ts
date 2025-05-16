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

export const entity = <const T extends Record<string, Model<Fields>>>(props: {
	fields: T extends T
		? {
				[K in keyof T]: Model<T[K]['type']>
			}
		: T
}) => {}

const a = entity({
	fields: {
		abc: {
			type: 'string',
			required: () => '123',
		},
	},
})
