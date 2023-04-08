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
	where(documentId(), '==', 'xyz/a')
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
	where(documentId(), '==', 'wrong/path/same/count')
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
	where(documentId(), '==', 'parent/abc/child')
) // bad: count mismatched
query(groupRef, where(documentId(), '==', 'parent/abc/child/xyz')) // good: count matched and correct type
//
//
//
//
//
//
//
query(
	colRef,
	where(documentId(), '>', 'xyz'),
	// @ts-expect-error
	orderBy('z')
) // bad: first orderBy field is incorrect
query(colRef, where(documentId(), '>', 'xyz'), orderBy('__name__')) // good: first orderBy field is correct
