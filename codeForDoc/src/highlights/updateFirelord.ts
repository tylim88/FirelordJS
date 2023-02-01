import {
	updateDoc,
	MetaTypeCreator,
	getFirelord,
	getFirestore,
} from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number
		b: number
		c: number
	},
	'abc',
	string
>
const db = getFirestore()
const docRef = getFirelord<abc>(db, 'abc').doc('efg')

const abcd = { a: 1, b: 2, c: 3, d: 4 }

updateDoc(
	docRef,
	{
		a: 1,
		b: 2,
		c: 3, // @ts-expect-error
		d: 4,
	} // good: type error!
)

updateDoc(
	docRef,
	//
	//
	//
	//
	//
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
	abcd // good: type error!
)

updateDoc(
	docRef,
	// @ts-expect-error
	{
		a: undefined,
		b: undefined,
	}
) // good: reject undefined! NOTE: this is not an issue if tsconfig exactOptionalPropertyTypes is ON

type abc2 = MetaTypeCreator<
	{
		a: number
		b: { c: number; d: number }
		e: { f: number; g: number }
	},
	'abc',
	string
>

const docRef2 = getFirelord<abc2>(db, 'abc').doc('efg')

updateDoc(
	docRef2,
	{
		a: 1,
		b: { c: 1 }, // nested form
		'e.f': 1,
	} // dot notation form
) // type pass, seem reasonable
