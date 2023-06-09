import {
	getFirestore,
	MetaTypeCreator,
	docCreator,
	collectionCreator,
	collectionGroupCreator,
	andCreator,
	orCreator,
	getFirelordShakable,
} from 'firelordjs'

type Example = MetaTypeCreator<
	{
		a: number
	},
	'someCollectionId',
	string
>
const db = getFirestore()

const getFirelord = getFirelordShakable({
	// all properties are optional
	// choose what to keep
	orCreator,
	andCreator,
	docCreator,
	collectionCreator,
	collectionGroupCreator,
})

const example = getFirelord<Example>(db, 'someCollectionId')
