import {
	MetaTypeCreator,
	getFirelord,
	query,
	where,
	orderBy,
	documentId,
} from 'firelordjs'

type parent = MetaTypeCreator<
	{
		a: number
	},
	'parent',
	string
>

type child = MetaTypeCreator<
	{
		a: { b: 'a' | 'b' | 'c'; c: boolean }
		d: number
		e: { f: string[] }
	},
	'child',
	string,
	parent
>
const firelordRef = getFirelord<child>()('parent/abc/child')
const colRef = firelordRef.collection()
const groupRef = getFirelord<child>()('parent/abc/child').collectionGroup()
//
//
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where('a.b', '==', 'a')
) // bad: no const assertion
query(colRef, where('a.b', '==', 'a' as const)) // good: with const assertion
//
const withoutAssertion = 'a'
const withAssertion = 'a' as const
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where('a.b', '==', withoutAssertion)
) // bad: no const assertion
query(colRef, where('a.b', '==', withAssertion)) // good: with const assertion
//
//
//
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where(documentId(), '==', 'xyz')
) // bad: no const assertion
query(colRef, where(documentId(), '==', 'xyz' as const)) // good: with const assertion
//
//
//
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where(documentId(), '==', 'xyz/a' as const)
) // bad: invalid characters
//
//
//
//
//
//
//
query(
	groupRef,
	// @ts-expect-error
	where(documentId(), '==', 'wrong/path/same/count' as const)
) // bad: slash count matched but path is wrong
//
//
//
//
//
//
//
//
query(
	groupRef,
	// @ts-expect-error
	where(documentId(), '==', 'parent/abc/child' as const)
) // bad: count mismatched
query(groupRef, where(documentId(), '==', 'parent/abc/child/xyz' as const)) // good: with const assertion and correct type
//
//
//
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where(documentId(), '>', 'xyz' as const),
	orderBy('a')
) // bad: first orderBy field is incorrect
query(colRef, where(documentId(), '>', 'xyz' as const), orderBy('__name__')) // good: first orderBy field is correct
