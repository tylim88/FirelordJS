import {
	MetaTypeCreator,
	getFirelord,
	query,
	where,
	orderBy,
	documentId,
	getFirestore,
} from 'firelordjs'

const db = getFirestore()

type Parent = MetaTypeCreator<
	{
		y: number
	},
	'parent',
	string
>

type Child = MetaTypeCreator<
	{
		z: 'a' | 'b' | 'c'
	},
	'child',
	string,
	Parent
>
const firelordRef = getFirelord<Child>(db, 'parent', 'child')
const colRef = firelordRef.collection('abc')
//
//
//
//
//
//
query(
	colRef,
	// @ts-expect-error
	where('z', '==', 'a')
) // bad: no const assertion
query(colRef, where('z', '==', 'a' as const)) // good: with const assertion
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
	where('z', '==', withoutAssertion)
) // bad: no const assertion
query(colRef, where('z', '==', withAssertion)) // good: with const assertion
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
	where(documentId(), '==', 'xyz')
) // bad: no const assertion
query(colRef, where(documentId(), '==', 'xyz' as const)) // good: with const assertion
