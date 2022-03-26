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

type abc = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'abc',
	string
>

const ref = getFirelord<abc>()('abc').collection()
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

// If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field
//
//
//
//
//
//
//
//
query(
	ref,
	// @ts-expect-error
	orderBy('a.b'),
	where('d', '>=', 2)
)

// You can't order your query by a field included in an equality (==) or (in) clause
//
//
//
//
query(
	ref,
	// @ts-expect-error
	orderBy('d'),
	where('d', '==', 1)
)

// You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query
query(
	ref,
	where('a.b', 'not-in', ['1']),
	//
	//
	//
	//
	// @ts-expect-error
	where('a.b', 'array-contains-any', ['1'])
)

// You can't combine not-in with not equals !=
//
//
//
//
query(
	ref,
	where('a.b', 'not-in', ['1']),
	// @ts-expect-error
	where('a.b', '!=', '1')
)

// You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any
query(
	ref,
	where('e.f', 'array-contains', '1'),
	//
	//
	//
	//
	//
	// @ts-expect-error
	where('e.f', 'array-contains', '2')
)

// Too many arguments provided to startAt/startAfter/endAt/endBefore(). The number of arguments must be less than or equal to the number of orderBy() clauses
//
//
//
//
//
query(
	ref,
	// @ts-expect-error
	startAfter(1)
) // Error: no orderBy
query(
	ref,
	// @ts-expect-error
	endBefore(1),
	orderBy('d')
) // Error: orderBy exist but should be placed before the cursor
query(
	ref,
	orderBy('a.b'),
	// @ts-expect-error
	endAt(1, 2)
) // Error: need 2 orderBy, but only 1

// You cannot use more than one '!=' filter (undocumented limitation)
//
//
//
//
query(
	ref,
	where('a.c', '!=', true),
	// @ts-expect-error
	where('a.c', '!=', false)
)
