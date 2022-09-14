import { MetaTypeCreator, getFirelord, getFirestore } from 'firelordjs'

const db = getFirestore()

type Parent = MetaTypeCreator<
	{
		a: number
	},
	'columnIDLevel1',
	string
>

type Child = MetaTypeCreator<
	{
		a: 'a' | 'b' | 'c'
		b: { c: number }
	},
	'columnIDLevel2',
	string,
	Parent
>

type GrandChild = MetaTypeCreator<
	{
		e: { f: boolean }[]
	},
	'columnIDLevel3',
	string,
	Child
>

const firelordRef = getFirelord<GrandChild>(
	db,
	'columnIDLevel1',
	'columnIDLevel2',
	'columnIDLevel3'
)

const docRef = firelordRef.doc('docIDLevel1', 'docIDLevel2', 'docIDLevel3')

const colRef = firelordRef.collection('docIDLevel1', 'docIDLevel2')

const colGroupRef = firelordRef.collectionGroup()

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
