import {
	limitToLast,
	query,
	MetaTypeCreator,
	getFirelord,
	orderBy,
	getFirestore,
} from 'firelordjs'
type a = MetaTypeCreator<
	{
		a: number
	},
	'a',
	string
>
const colRef = getFirelord<a>(getFirestore(), 'a').collection()
//
//
//
//
// @ts-expect-error
query(colRef, limitToLast(45)) // error, need at least one orderBy
query(colRef, orderBy('a'), limitToLast(-1 as number)) // ok, number type
