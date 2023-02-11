import { MetaTypeCreator, getFirelord, getFirestore } from 'firelordjs'

const db = getFirestore()

export type Parent = MetaTypeCreator<
	{
		a: number
	},
	'columnIDLevel1', // collectionId type
	string, // docId type
	null // you can skip this, top collection don't need parent
>

export type Child = MetaTypeCreator<
	{
		a: 'a' | 'b' | 'c'
		b: { c: number }
	},
	'columnIDLevel2', // collectionId type
	string, // docId type
	Parent // child's parent is Parent
>

export type GrandChild = MetaTypeCreator<
	{
		e: { f: boolean }[]
	},
	'columnIDLevel3', // collectionId type
	string, // docId type
	Child // grandChild's parent is child
>

export const parentRef = getFirelord<Parent>(
	db,
	'columnIDLevel1' // parent col ID
)

export const childRef = getFirelord<Child>(
	db,
	'columnIDLevel1', // parent col ID
	'columnIDLevel2' // child col ID
)

export const grandChildRef = getFirelord<GrandChild>(
	db,
	'columnIDLevel1', // parent col ID
	'columnIDLevel2', // child col ID
	'columnIDLevel3' // grandChild col ID
)

// doc ref
export const parentDocRef = parentRef.doc(
	'docIDLevel1' // parent doc ID
)
export const childDocRef = childRef.doc(
	'docIDLevel1', // parent doc ID
	'docIDLevel2' // child doc ID
)
export const grandChildDocRef = grandChildRef.doc(
	'docIDLevel1', // parent doc ID
	'docIDLevel2', // child doc ID
	'docIDLevel3' // grand child doc ID
)

// collectionRef require only ANCESTORS document ID
export const parentColRef = parentRef.collection()
export const childColRef = childRef.collection(
	'docIDLevel1' // parent doc ID
)
export const grandChildColRef = grandChildRef.collection(
	'docIDLevel1', // parent doc ID
	'docIDLevel2' // child doc ID
)

// collection group doesn't need any ID.
export const parentColGroupRef = parentRef.collectionGroup()
export const childColGroupRef = childRef.collectionGroup()
export const grandChildColGroupRef = grandChildRef.collectionGroup()

const firelordRef2 = getFirelord<GrandChild>(
	db,
	'columnIDLevel1',
	'columnIDLevel2',
	//
	//
	//
	// @ts-expect-error
	'unknownCollectionName'
)
//
//
//
//
//
//
// @ts-expect-error
const firelordRef3 = getFirelord<GrandChild>(
	//
	//
	//
	//
	//
	db,
	'columnIDLevel1',
	'columnIDLevel2'
)

type read = Child['read']
type write = Child['write']
type writeFlatten = Child['writeFlatten']
type compare = Child['compare']

type member = writeFlatten['b.c']
