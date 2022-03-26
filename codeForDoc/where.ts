import {
	MetaTypeCreator,
	getFirelord,
	query,
	where,
	orderBy,
	startAfter,
	endBefore,
	endAt,
} from 'firelordjs'

const firelord = getFirelord()

type parent = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'parent',
	string
>

type child = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'child',
	string,
	parent
>
// @ts-expect-error
const ref = getFirelord<child>()('parent//child').collection()
//
//
//
//
//
//
query(
	ref,
	where('a.b', '>', 'abc'),
	// @ts-expect-error
	where('a.c', '!=', true)
)
