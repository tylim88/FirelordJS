import {
	MetaTypeCreator,
	getFirelord,
	DocumentReference,
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
		a: 'a' | 'b' | 'c'
		b: { c: number }
	},
	'child',
	string,
	Parent
>
//
//
//
//
//
const firelordRef = getFirelord<Child>(
	db,
	'parent',
	'child',
	// @ts-expect-error
	'abc'
)
//
//
//
//
//
//
//
const firelordRef2 = getFirelord<Child>(
	db,
	// @ts-expect-error
	'par222ent',
	'ch333ild'
)

type read = Child['read']
type write = Child['write']
type writeFlatten = Child['writeFlatten']
type compare = Child['compare']

type member = writeFlatten['b.c']
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
type abc = MetaTypeCreator<
	{
		a: { b: number } | { c: string }
	},
	'parent',
	string
>
//
//
//
//
//
//
//
//
//
const collectionReferenceParent = getFirelord<Child>(
	db,
	'parent',
	'child'
).collection('abc').parent

const collectionReferenceParentTypeCasted = getFirelord<Child>(
	db,
	'parent',
	'child'
).collection('abc').parent as unknown as DocumentReference<Parent>
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
type abc2 = MetaTypeCreator<Record<number, unknown>, 'parent', string>
