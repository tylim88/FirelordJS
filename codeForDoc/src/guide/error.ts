import {
	query,
	where,
	orderBy,
	limit,
	MetaTypeCreator,
	getFirestore,
	getFirelord,
} from 'firelordjs'
import { initializeApp } from 'firebase/app'

// not yet finish

export type Example = MetaTypeCreator<
	{
		a: number
	},
	'SomeCollectionName'
>

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore(app)

export const example = getFirelord<Example>(db, 'SomeCollectionName')
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
