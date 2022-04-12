import { MetaTypeCreator } from 'firelordjs'

export type Parent = MetaTypeCreator<
	{
		a: number
	},
	'IAmParent',
	string
>

export type Child = MetaTypeCreator<
	{
		b: string
	},
	'IAmChild',
	string,
	Parent
>
