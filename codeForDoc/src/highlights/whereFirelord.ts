import {
	MetaTypeCreator,
	getFirelord,
	query,
	where,
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
//
//
// @ts-expect-error
query(colRef, where('a', 'in', [])) // never[] type is not ok
//
const arr = (): ('a' | 'b' | 'c')[] => {
	return []
} // empty array may result from expression
query(colRef, where('z', 'in', arr())) // impossible to block correctType[]
