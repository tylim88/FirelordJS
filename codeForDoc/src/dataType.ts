import { MetaTypeCreator, ServerTimestamp } from 'firelordjs'

export type Example = MetaTypeCreator<
	{
		a: number
		b: { c: boolean; d: { e: string }[] }
		f: { g: ServerTimestamp; h: 1010 | 2929 | 3838 }
	},
	'SomeCollectionName',
	string // document ID type, normally string
>
