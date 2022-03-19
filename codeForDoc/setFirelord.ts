import { setDoc, MetaTypeCreator, getFirelord } from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number
		b: number
		c: number
	},
	'abc',
	string
>

const firelord = getFirelord()

const docRef = firelord<abc>('abc').doc('efg')

const abcd = { a: 1, b: 2, c: 3, d: 4 }

setDoc(
	docRef, // @ts-expect-error
	{ a: 1, b: 2, c: 3, d: 4 } // good: type error!
)

setDoc(
	docRef, // @ts-expect-error
	abcd // good: type error!
)

type abc2 = MetaTypeCreator<
	{
		a: number
		b: { c: number; d: number }
		e: { f: number; g: number }
	},
	'abc',
	string
>

const docRef2 = getFirelord()<abc2>('abc').doc('efg')

setDoc(
	docRef2,
	{
		a: 1,
		b: { c: 1 },
		// @ts-expect-error
		e: undefined, // good, reject undefined!
	},
	{ merge: true }
)

setDoc(
	docRef2,
	{
		a: 1,
		b: { c: 1 },
	},
	{
		mergeFields: [
			// @ts-expect-error
			'j.k',
		],
	} // good, reject unknown path
)

setDoc(
	docRef2, // @ts-expect-error
	{
		a: 1,
		'b.c': 1,
	}, // reject unknown member
	{ merge: true }
)
