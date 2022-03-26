import { MetaTypeCreator, getFirelord, DocumentReference } from 'firelordjs'

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
const firelordRef = getFirelord<Child>()(
	// @ts-expect-error
	'parent//child'
)
//
//
//
//
//
//
//
const firelordRef2 = getFirelord<Child>()(
	// @ts-expect-error
	'par222ent/abc/ch333ild'
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
const collectionReferenceParent =
	getFirelord<Child>()('parent/abc/child').collection().parent

const collectionReferenceParentTypeCasted = getFirelord<Child>()(
	'parent/abc/child'
).collection().parent as unknown as DocumentReference<Parent>
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
