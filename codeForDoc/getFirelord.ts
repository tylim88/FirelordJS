import { getDoc, MetaTypeCreator, getFirelord } from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number
		b: { c: number; d: number }
		e: { f: number; g: number }
	},
	'abc',
	string
>

const firelord = getFirelord()

const docRef = firelord<abc>('abc').doc('efg')
