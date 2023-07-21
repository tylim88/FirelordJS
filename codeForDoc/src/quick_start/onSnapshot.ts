import { example } from './init'
import { query, where, orderBy, onSnapshot, startAfter } from 'firelordjs'

// listen to filtered collection
const unsub = onSnapshot(
	query(
		example.collection(), // or example.collectionGroup()
		where('b.d', 'array-contains', { e: 'hello' }),
		orderBy('f.g'),
		startAfter(new Date())
	),
	querySnapshot => {
		// return querySnapshot similar to querySnapshot of getDocs
	},
	error => {
		// handle error
	},
	{ includeMetadataChanges: false }
)

// listen to entire collection
const unsub2 = onSnapshot(
	example.collection(), // or example.collectionGroup()
	querySnapshot => {
		// return querySnapshot similar to querySnapshot of getDocs
	},
	error => {
		// handle error
	},
	{ includeMetadataChanges: false }
)

// listen to a single document
const unsub3 = onSnapshot(
	example.doc('abc'),
	docSnapshot => {
		// return docSnapshot similar to docSnapshot of getDoc
	},
	error => {
		// handle error
	},
	{ includeMetadataChanges: true }
)

// remove listeners
unsub()
unsub2()
unsub3()
