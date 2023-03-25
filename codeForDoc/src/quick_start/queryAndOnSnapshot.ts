import { example } from './init'
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
		where('f.h', '>', 1010),
		orderBy('f.h'),
		limit(10)
	)
).then(querySnapshot => {
	querySnapshot.docChanges().forEach((docChange, index) => {
		docChange.doc // return docSnapshot similar to docSnapshot of getDoc
		docChange.type // 'added', 'modified', or 'removed'
		docChange.oldIndex // number
		docChange.newIndex //  number
	})
	querySnapshot.forEach(docSnapshot => {
		// this forEach is not native forEach, it has no index
		// similar to docSnapshot of getDoc
	})
	querySnapshot.docs.forEach((docSnapshot, index) => {
		// similar to docSnapshot of getDoc
	})
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

// get collection aggregated count
getCountFromServer(example.collection()).then(aggregatedQuerySnapshot => {
	const count = aggregatedQuerySnapshot.data().count
})

// get query aggregated count
getCountFromServer(query(example.collection(), where('a', '>', 1))).then(
	aggregatedQuerySnapshot => {
		const count = aggregatedQuerySnapshot.data().count
	}
)
