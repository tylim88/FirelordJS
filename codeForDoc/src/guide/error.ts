import {
	query,
	where,
	MetaTypeCreator,
	getFirestore,
	getFirelord,
} from 'firelordjs'
import { initializeApp } from 'firebase/app'

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore(app)

export const example = getFirelord<Example>(db, 'SomeCollectionName')
//
export type Example = MetaTypeCreator<
	{
		a: number
	},
	'SomeCollectionName'
>
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
query(
	example.collection(),
	// @ts-expect-error
	where('a.b', '!=', 'z')
)

query(
	example.collection(),
	// @ts-expect-error
	example.or(
		//
		where('a', '!=', 1),
		//
		//
		//
		// @ts-expect-error
		where('a', '!=', 50)
	)
)

query(
	example.collection(),
	// @ts-expect-error
	example.or(
		//
		where('a', '!=', 1),
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		// @ts-expect-error
		example.and(example.or(where('a', '!=', 50)))
	)
)
