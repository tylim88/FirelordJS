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
	{ a: 1, b: 2, c: 3, d: 4 } // bad: no type error
)

updateDoc(
	docRef,
	abcd // bad: does not reject 'd'
)

// Accept `undefined` but `undefined` is not a valid Firestore value.
updateDoc(docRef, { a: undefined, b: undefined }) // bad: does not reject 'undefined' even with exactOptionalPropertyTypes

type abc2 = DocumentReference<{
	a: number
	b: { c: number; d: number }
	e: { f: number; g: number }
}>

updateDoc(doc(getFirestore(), 'abc/efg') as abc2, {
	a: 1,
	b: { c: 1 },
	'e.f': 1,
}) // type pass, seem reasonable
