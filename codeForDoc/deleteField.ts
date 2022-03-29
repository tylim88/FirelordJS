import {
	setDoc,
	doc,
	getFirestore,
	DocumentReference,
	deleteField,
	updateDoc,
} from 'firebase/firestore'

type abc = DocumentReference<{
	a: number
	b: { c: string }
}>

const docRef = doc(getFirestore(), 'abc/efg') as abc

// =======set==========
setDoc(docRef, {
	a: deleteField(),
	b: { c: deleteField() },
}) // bad, runtime error!

setDoc(
	docRef,
	{
		a: deleteField(),
		b: { c: deleteField() },
	},
	{ merge: true }
) // good!

setDoc(
	docRef,
	{
		a: deleteField(),
		b: { c: deleteField() },
	},
	{ mergeFields: [] }
) // good!

// =======update==========
updateDoc(docRef, {
	'b.c': deleteField(), // good, 'a' is top level
	b: { c: deleteField() }, // bad, c is not top level, runtime exception!
})
