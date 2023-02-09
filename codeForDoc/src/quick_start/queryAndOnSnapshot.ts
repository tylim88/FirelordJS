import { example } from './create_firelord_ref'
import {
	getDocs,
	query,
	where,
	orderBy,
	onSnapshot,
	startAfter,
	limit,
	getCountFromServer,
} from 'firelordjs'

// filter documents
getDocs(
	query(
		example.collection(),
		where('f.h', '>', 1010 as const),
		orderBy('f.h'),
		limit(10)
	)
).then(querySnapshot => {
	querySnapshot.docChanges().forEach(docChange => {
		docChange.doc
		docChange.type
		docChange.oldIndex
		docChange.newIndex
	})
	querySnapshot.forEach(docSnapshot => {})
	querySnapshot.docs.forEach(docSnapshot => {})
})

// filter and listen to documents
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

// listen to a single document
const unsub2 = onSnapshot(
	example.doc('abc'),
	docSnapshot => {},
	error => {},
	{ includeMetadataChanges: true }
)

// remove listeners
unsub()
unsub2()

// get aggregated count
getCountFromServer(query(example.collection(), where('a', '>', 1))).then(
	aggregatedQuerySnapshot => {
		const count = aggregatedQuerySnapshot.data().count
	}
)
