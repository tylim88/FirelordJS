import { Firelord, ServerTimestampFieldValue } from 'firelordjs'

export type Example = Firelord<
	{
		a: number
		b: { c: boolean; d: { e: string }[] }
		f: { g: ServerTimestampFieldValue; h: 1010 | 2929 | 3838 }
	},
	'SomeCollectionName',
	string // document ID type, normally string
>
