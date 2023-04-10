import { example } from './init'
import { query, where, orderBy, limit } from 'firelordjs'

query(
	example.collection(),
	orderBy('f.h'),
	limit(10),
	example.or(
		where('f.h', '>', 2929),
		where('a', '==', 1),
		// you can nest composite query https://firebase.google.com/docs/firestore/query-data/queries#disjunctive_normal_form
		example.and(
			where('f.g', 'in', [new Date(999), new Date(3000)]),
			where('b.d', 'array-contains', { e: 'a' })
		)
	)
)
