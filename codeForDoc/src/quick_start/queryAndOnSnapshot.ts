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
		error => {},
		{ includeMetadataChanges: false }
	)

	const unsub2 = onSnapshot(
		example.doc('abc'),
		documentSnapshot => {
			const data = documentSnapshot.data()
		},
		error => {},
		{ includeMetadataChanges: true }
	)
}
