import {
	query,
	where,
	MetaTypeCreator,
	getFirelord,
	getFirestore,
} from 'firelordjs'

export type Example = MetaTypeCreator<
	{
		a: number
		b: string
	},
	'a',
	string // document ID type, normally string
>

const ref = getFirelord<Example>(getFirestore(), 'a')

query(
	ref.collection(),
	// @ts-expect-error
	// top level `or` query
	ref.or(
		where('a', '>', 1),
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		// @ts-expect-error
		ref.and(where('b', 'not-in', ['xyz'])) // nested `and` query
	)
)
