import { example } from './init'
import {
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	addDoc,
	serverTimestamp,
	increment,
	arrayUnion,
} from 'firelordjs'

export const dummy = async () => {
	await setDoc(example.doc('abc'), {
		a: 100,
		b: { c: true, d: [{ e: 'abc' }] },
		f: { g: serverTimestamp(), h: 1010 },
	})

	await updateDoc(example.doc('abc'), {
		a: increment(1),
		'b.d': arrayUnion({ e: 'hello' }), // dot notation form
		f: { h: 2929 }, // nested form
	})

	await deleteDoc(example.doc('abc'))

	await getDoc(example.doc('abc')).then(docSnapshot => {
		docSnapshot.data()
		docSnapshot.exists()
		docSnapshot.get('b.c')
		docSnapshot.id
		docSnapshot.metadata.fromCache
		docSnapshot.metadata.hasPendingWrites
		docSnapshot.metadata.isEqual

		docSnapshot.ref.firestore
		docSnapshot.ref.id
		docSnapshot.ref.path
		docSnapshot.ref.type

		docSnapshot.ref.parent
		docSnapshot.ref.parent.firestore
		docSnapshot.ref.parent.id
		docSnapshot.ref.parent.parent
		docSnapshot.ref.parent.path
		docSnapshot.ref.parent.type
	})

	// in case you want to create auto id doc
	await addDoc(example.collection(), {
		a: 900,
		b: { c: false, d: [{ e: 'hi' }] },
		f: { g: serverTimestamp(), h: 3838 },
	})
	// in case you just want auto id doc ref
	const autoIdDocRef = example.doc(example.collection())
}
