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
	Parent // child's parent is Parent
>

type GrandChild = MetaTypeCreator<
	{
		e: { f: boolean }[]
	},
	'columnIDLevel3',
	string,
	Child // grandChild's parent is child
>

const firelordRef = getFirelord<GrandChild>(
	db,
	'columnIDLevel1', // parent
	'columnIDLevel2', // child
	'columnIDLevel3' // grandChild
)

// full doc path is columnIDLevel1/docIDLevel1/columnIDLevel2/docIDLevel2/columnIDLevel3/docIDLevel3
const docRef = firelordRef.doc('docIDLevel1', 'docIDLevel2', 'docIDLevel3')

// full collection path is columnIDLevel1/docIDLevel1/columnIDLevel2/docIDLevel2/columnIDLevel3
// full collection path don't need the last docID, in this case docIDLevel3
const colRef = firelordRef.collection('docIDLevel1', 'docIDLevel2')

// collection group don't need any argument regardless of descendant level.
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
