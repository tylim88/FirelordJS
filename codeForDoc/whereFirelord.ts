import {
	MetaTypeCreator,
	getFirelord,
	query,
	where,
	orderBy,
	documentId,
} from 'firelordjs'

type Parent = MetaTypeCreator<
	{
		a: number
	},
	'parent',
	string
>

type Child = MetaTypeCreator<
	{
		a: 'a' | 'b' | 'c'
	},
	'child',
	string,
	Parent
>
const firelordRef = getFirelord<Child>()('parent/abc/child')
const colRef = firelordRef.collection()
const groupRef = getFirelord<Child>()('parent/abc/child').collectionGroup()
//
//
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where('a', '==', 'a')
) // bad: no const assertion
query(colRef, where('a', '==', 'a' as const)) // good: with const assertion
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
	where('a', '==', withoutAssertion)
) // bad: no const assertion
query(colRef, where('a', '==', withAssertion)) // good: with const assertion
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
query(groupRef, where(documentId(), '==', 'parent/abc/child/xyz' as const)) // good: count matched and correct type
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
//
//
//
//
//
//
//
//
// @ts-expect-error
query(colRef, where('a', 'in', [])) // never[] type is not ok
//
const arr = (): ('a' | 'b' | 'c')[] => {
	return []
} // empty array may result from expression
query(colRef, where('a', 'in', arr())) // impossible to block correctType[]
