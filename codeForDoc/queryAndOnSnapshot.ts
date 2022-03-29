import { example } from './init'
import {
	getDocs,
	query,
	where,
	orderBy,
	onSnapshot,
	startAfter,
	limit,
} from 'firelordjs'

export const dummy = async () => {
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
