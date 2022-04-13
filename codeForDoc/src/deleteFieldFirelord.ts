import {
	updateDoc,
	MetaTypeCreator,
	getFirelord,
	DeleteField,
	deleteField,
	getDoc,
	setDoc,
} from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number | DeleteField
		b: number
	},
	'abc',
	string
>

const docRef = getFirelord<abc>()('abc').doc('efg')

updateDoc(docRef, {
	a: deleteField(), // can delete 'a'
	// @ts-expect-error
	b: deleteField(), // cannot delete 'b'
})

getDoc(docRef).then(docSnap => {
	//
	//
	//
	//
	//
	//
	//
	//
	//
	const data = docSnap.data()
})

type abc2 = MetaTypeCreator<
	{
		a: DeleteField[]
		b: { c: DeleteField }[]
	},
	'abc',
	string
>

const docRef2 = getFirelord<abc2>()('abc').doc('efg')

updateDoc(docRef2, {
	//
	//
	//
	//
	//
	//
	//
	//
	// @ts-expect-error
	a: [deleteField()], // @ts-expect-error
	b: [{ c: deleteField() }],
})

type abc3 = MetaTypeCreator<
	{
		a: number[] | DeleteField
	},
	'abc',
	string
>

const docRef3 = getFirelord<abc3>()('abc').doc('efg')

updateDoc(docRef3, {
	//
	//
	a: deleteField(),
})

type abc4 = MetaTypeCreator<
	{
		a: number | DeleteField
		b: { c: string | DeleteField }
	},
	'abc',
	string
>
const docRef4 = getFirelord<abc4>()('abc').doc('efg')
// =======set==========
setDoc(docRef4, {
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
	a: deleteField(), // @ts-expect-error
	b: { c: deleteField() },
}) // bad but with with protection!

setDoc(
	docRef4,
	{
		// @ts-expect-error
		a: deleteField(), // @ts-expect-error
		b: { c: deleteField() },
	},
	{ merge: false }
) // bad but with protection!

setDoc(
	docRef4,
	{
		a: deleteField(),
		b: { c: deleteField() },
	},
	{ merge: true }
) // good!

setDoc(
	docRef4,
	{
		a: deleteField(),
		b: { c: deleteField() },
	},
	{ mergeFields: [] }
) // good!

// =======update==========
updateDoc(docRef4, {
	'b.c': deleteField(), // good, 'b.c' is top level
	b: { c: deleteField() }, // good, FirelordJS flatten it internally.
})
