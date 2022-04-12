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
// ! type messed up, expect error need to move to top after adding firestore of testing type, weird
// @ts-expect-error
setDoc(
	docRef,
	{
		a: 1,
		b: 2,
		c: 3,
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

// ! type messed up, expect error need to move to top after adding firestore of testing type, weird
// @ts-expect-error
setDoc(
	docRef2,
	{
		a: 1,
		'b.c': 1, // reject unknown member
	},
	{ merge: true }
)
