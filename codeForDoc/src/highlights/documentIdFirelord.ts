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
		a: number
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
const groupRef = getFirelord<Child>(db, 'parent', 'child').collectionGroup()
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
	orderBy('z')
) // bad: first orderBy field is incorrect
query(colRef, where(documentId(), '>', 'xyz' as const), orderBy('__name__')) // good: first orderBy field is correct
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
