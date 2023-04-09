import { example } from './init'
import { query, where, getCountFromServer } from 'firelordjs'

// get collection aggregated count
getCountFromServer(
	example.collection() // also accept example.collectionGroup()
).then(aggregatedQuerySnapshot => {
	const count = aggregatedQuerySnapshot.data().count
})

// get query aggregated count
getCountFromServer(
	query(
		example.collection(), // also accept example.collectionGroup()
		where('a', '>', 1)
	)
).then(aggregatedQuerySnapshot => {
	const count = aggregatedQuerySnapshot.data().count
})
