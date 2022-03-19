import {
	updateDoc,
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
updateDoc(
	docRef,
	// @ts-expect-error
	{ a: 1, b: 2, c: 3, d: 4 } // good: type error!
)

updateDoc(
	docRef,
	abcd // bad: does not reject 'd'
)

// Accept `undefined` but `undefined` is not a valid Firestore value.
updateDoc(docRef, { a: undefined, b: undefined }) // bad: does not reject 'undefined', runtime exception!

type abc2 = DocumentReference<{
	a: number
	b: { c: number; d: number }
	e: { f: number; g: number }
}>

updateDoc(
	doc(getFirestore(), 'abc/efg') as abc2,
	{
		a: 1,
		b: { c: 1 }, // nested form
		'e.f': 1,
	} // dot notation form
) // type pass, seem reasonable
