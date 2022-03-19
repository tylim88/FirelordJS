import {
	setDoc,
	doc,
	getFirestore,
	DocumentReference,
} from 'firebase/firestore'

const abcd = { a: 1, b: 2, c: 3, d: 4 }

type abc = DocumentReference<{
	a: number
	b: number
	c: number
}>

const docRef = doc(getFirestore(), 'abc/efg') as abc

// Accept unknown member from stale value
setDoc(
	docRef,
	{
		a: 1,
		b: 2,
		c: 3,
		// @ts-expect-error
		d: 4,
	} // good: type error!
)

setDoc(
	docRef,
	abcd // bad: does not reject 'd'
)

type abc2 = DocumentReference<{
	a: number
	b: { c: number; d: number }
	e: { f: number; g: number }
}>

const docRef2 = doc(getFirestore(), 'abc/efg') as abc2

setDoc(
	docRef2,
	{
		a: 1,
		b: { c: 1 },
		e: undefined, // bad, does not reject undefined
	},
	{ merge: true }
)

setDoc(
	docRef2,
	{
		a: 1,
		b: { c: 1 },
	},
	{ mergeFields: ['j.k'] } // bad: accepts unknown path
)

setDoc(
	docRef2,
	{
		a: 1, // @ts-expect-error
		'b.c': 1, // reject unknown member
	},
	{ merge: true }
)
