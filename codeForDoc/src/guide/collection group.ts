import { MetaTypeCreator, getFirelord, getFirestore } from 'firelordjs'

const db = getFirestore()

type Parent = MetaTypeCreator<
	{
		a: 1
	},
	'a',
	string
>
const firelordParent = getFirelord<Parent>
const ParentCollectionGroupQuery = firelordParent(db, 'a').collectionGroup()

type Child = MetaTypeCreator<
	{
		a: 1
	},
	'b',
	string,
	Parent
>
const firelordChild = getFirelord<Child>

const ChildCollectionGroupQuery = firelordChild(db, 'a', 'b').collectionGroup()

const a = [1, 2, 3].forEach(i => {
	exports[i]
})
