import { updateDoc, Firelord, getFirelord } from 'firelordjs'
import { getFirestore } from 'firebase/firestore'

type abc = Firelord<
	{
		a: number
		b: number
		c: number
	},
	'abc',
	string
>

const firelord = getFirelord(getFirestore())

const docRef = firelord<abc>('abc').doc('efg')

const abcd = { a: 1, b: 2, c: 3, d: 4 }

updateDoc(
	docRef,
	// @ts-expect-error
	{ a: 1, b: 2, c: 3, d: 4 } // good: type error!
)
//
//
//
//
//
//
//
//
//
updateDoc(
	docRef, // @ts-expect-error
	abcd // good: type error!
)

updateDoc(docRef, {
	// @ts-expect-error
	a: undefined,
	// @ts-expect-error
	b: undefined,
}) // good: reject undefined!

type abc2 = Firelord<
	{
		a: number
		b: { c: number; d: number }
		e: { f: number; g: number }
	},
	'abc',
	string
>

const docRef2 = getFirelord(getFirestore())<abc2>('abc').doc('efg')

updateDoc(
	docRef2,
	{
		a: 1,
		b: { c: 1 }, // nested form
		'e.f': 1,
	} // dot notation form
) // type pass, seem reasonable
