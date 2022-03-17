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

// Accept unknown member from stale value
setDoc(
	doc(getFirestore(), 'abc/efg') as abc,
	{ a: 1, b: 2, c: 3, d: 4 } // good: type error!
)

setDoc(
	doc(getFirestore(), 'abc/efg') as abc,
	abcd // bad: does not reject 'd'
)

// Accept `undefined` but `undefined` is not a valid Firestore value.
setDoc(doc(getFirestore(), 'abc/efg') as abc, { a: undefined, b: undefined }) // bad: does not reject 'undefined', runtime exception!

setDoc(
	doc(getFirestore(), 'abc/efg') as DocumentReference<{
		a: number
		b: { c: number; d: number }
		e: { f: number; g: number }
	}>,
	{
		a: 1,
		b: { c: 1 }, // nested form
		'e.f': 1,
	} // dot notation form
) // type pass, seem reasonable
