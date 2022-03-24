import { MetaTypeCreator, getFirelord, query, where } from 'firelordjs'

const firelord = getFirelord()

type abc = MetaTypeCreator<
	{
		a: { b: number; c: number }
		d: number
	},
	'abc',
	string
>

const ref = firelord<abc>('abc')

const collectionRef = ref.collection()

query(
	collectionRef,
	where('a.b', '>', 2),
	// @ts-expect-error
	where('a.c', '!=', 2)
)
