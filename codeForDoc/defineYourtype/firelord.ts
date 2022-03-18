import { Firelord } from 'firelordjs'

export type Parent = Firelord<
	{
		a: number
	},
	'IAmParent',
	string
>

export type Child = Firelord<
	{
		b: string
	},
	'IAmChild',
	string,
	Parent
>
