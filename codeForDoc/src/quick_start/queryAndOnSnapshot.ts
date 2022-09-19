import { example } from './create_firelord_ref'
import {
	getDocs,
	query,
	where,
	orderBy,
	onSnapshot,
	startAfter,
	limit,
} from 'firelordjs'

getDocs(
	query(
		example.collection(),
		where('f.h', '>', 1010 as const),
		orderBy('f.h'),
		limit(10)
	)
).then(querySnapshot => {
	querySnapshot.docChanges().forEach(docChange => {
		console.log(docChange.doc)
		console.log(docChange.type)
		console.log(docChange.oldIndex)
		console.log(docChange.newIndex)
	})
	querySnapshot.forEach(docSnapshot => {})

	querySnapshot.docs.forEach(docSnapshot => {})
})

const unsub = onSnapshot(
	query(
		example.collectionGroup(),
		where('b.d', 'array-contains', { e: 'hello' }),
		orderBy('f.g'),
		startAfter(new Date())
	),
	querySnapshot => {},
	error => {},
	{ includeMetadataChanges: false }
)

const unsub2 = onSnapshot(
	example.doc('abc'),
	docSnapshot => {},
	error => {},
	{ includeMetadataChanges: true }
)
