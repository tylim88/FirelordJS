import {
	setDoc,
	MetaTypeCreator,
	getFirelord,
	getFirestore,
	query,
	where,
} from 'firelordjs'
type a = MetaTypeCreator<
	{
		a: [][]
		b: string[][]
		c: never[][]
		d: [[]]
	},
	'a',
	string
>
const docRef = getFirelord<a>(getFirestore(), 'a').doc('1')
setDoc(docRef, {
	//
	//
	//
	//
	//
	//
	//
	//
	//
	// @ts-expect-error
	a: [[]], // type a is "Error: Direct Nested Array is not a valid Firestore type"
	// @ts-expect-error
	b: [['abc']], // type b is "Error: Direct Nested Array is not a valid Firestore type"
	// @ts-expect-error
	c: [[]], // type c is "Error: Direct Nested Array is not a valid Firestore type"
	// @ts-expect-error
	d: [[]], // type d is "Error: Direct Nested Array is not a valid Firestore type"
})

type b = MetaTypeCreator<
	{
		x: { y: number; z: string }[]
	},
	'a',
	string
>
const docRef2 = getFirelord<b>(getFirestore(), 'a').collection()
query(docRef2, where('x', 'array-contains', { y: 1, z: 'h' })) // ok
query(docRef2, where('x', '==', [{ y: 1, z: 'h' }])) // ok
// @ts-expect-error
query(docRef2, where('x.y', '!=', 1)) // nested path is not possible
