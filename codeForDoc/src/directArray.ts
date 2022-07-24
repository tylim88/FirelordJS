import { setDoc, MetaTypeCreator, getFirelord } from 'firelordjs'
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
const docRef = getFirelord<a>()('a').doc('1')
//
//
//
//
//
//
//
//
//
setDoc(docRef, {
	// @ts-expect-error
	a: [[]], // type a is "Error: Direct Nested Array is not a valid Firestore type"
	// @ts-expect-error
	b: [['abc']], // type b is "Error: Direct Nested Array is not a valid Firestore type"
	// @ts-expect-error
	c: [[]], // type c is "Error: Direct Nested Array is not a valid Firestore type"
	// @ts-expect-error
	d: [[]], // type d is "Error: Direct Nested Array is not a valid Firestore type"
})
