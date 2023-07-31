import { example } from './init'
import { getDocs, query, where, orderBy, limit } from 'firelordjs'

// filter documents
getDocs(
	query(
		example.collection(), // or example.collectionGroup()
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
		// native forEach
		// similar to docSnapshot of getDoc
	})
})

// get all collection documents
getDocs(
	example.collection() // or example.collectionGroup()
)
