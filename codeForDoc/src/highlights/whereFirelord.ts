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

const fs = getFirestore()

type ABC = MetaTypeCreator<
	{
		a: 1 | 2 | 3 // literal type
		b: ('a' | 'b' | 'c')[] // literal type
	},
	'ABC'
>

const ColRef = getFirelord<ABC>(db, 'ABC').collection()

// literal type
query(ColRef, where('a', '>', 1)) // ok, not dealing with array
// @ts-expect-error
query(ColRef, where('a', 'in', [1])) // not ok, it is an array AND literal type, need const assertion!
query(ColRef, where('a', 'in', [1 as const])) // ok, const assertion!
query(ColRef, where('a', 'in', [1] as const)) // ok, const assertion!

// literal array type
// @ts-expect-error
query(ColRef, where('b', '==', ['a'])) // not ok, dealing with array AND literal type, need const assertion!
query(ColRef, where('b', '==', ['a' as const])) // ok, const assertion!
query(ColRef, where('b', 'in', [['a' as const]])) // ok, const assertion!
query(ColRef, where('b', '==', ['a'] as const)) // ok, const assertion!
query(ColRef, where('b', 'in', [['a'] as const])) // ok, const assertion!
query(ColRef, where('b', 'in', [['a']] as const)) // ok, const assertion!
