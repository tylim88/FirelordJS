import { Firelord, getFirelord } from 'firelordjs'

export type Example = Firelord<
	{
		a: number
	},
	'SomeCollectionName',
	string
>

const firelordRef = getFirelord()
const example = firelordRef<Example>('SomeCollectionName')
example.doc('docID')
example.collection()
example.collectionGroup()
