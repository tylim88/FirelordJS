import { example } from './init'
import {
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	deleteDoc,
	addDoc,
	query,
	serverTimestamp,
	increment,
	arrayUnion,
	where,
	orderBy,
	onSnapshot,
	startAfter,
	limit,
} from 'firelordjs'

export const dummy = async () => {
	await setDoc(example.doc('abc'), {
		a: 100,
		b: { c: true, d: [{ e: 'abc' }] },
		f: { g: serverTimestamp(), h: 1010 },
	})

	await addDoc(example.collection(), {
		a: 900,
		b: { c: false, d: [{ e: 'hi' }] },
		f: { g: serverTimestamp(), h: 3838 },
	})

	await updateDoc(example.doc('abc'), {
		a: increment(1),
		'b.d': arrayUnion({ e: 'hello' }), // dot notation form
		f: { h: 2929 }, // nested form
	})

	await deleteDoc(example.doc('abc'))

	await getDoc(example.doc('abc')).then(docSnapshot => {
		const data = docSnapshot.data()
	})

	await getDocs(
		query(
			example.collection(),
			where('f.h', '>', 1010 as const),
			orderBy('f.h'),
			limit(10)
		)
	)

	const unsub = onSnapshot(
		query(
			example.collection(),
			where('b.d', 'array-contains', { e: 'hello' }),
			orderBy('f.g'),
			startAfter(new Date())
		),
		querySnapshot => {
			querySnapshot.forEach(docSnapshot => {
				const data = docSnapshot.data()
			})
		},
		{ includeMetadataChanges: false } // optional
	)
}
