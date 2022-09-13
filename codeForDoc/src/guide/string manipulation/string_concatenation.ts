import { MetaTypeCreator, getFirelord, getFirestore } from 'firelordjs'

const db = getFirestore()

type Example = MetaTypeCreator<
	{
		a: number
	},
	'colName',
	`${string}12345`
>

const suffix = 12345
//
//
//
//
const docRef = getFirelord<Example>(db, 'colName').doc(
	// @ts-expect-error
	'a' + suffix
) // type error, type is string!

const docRef2 = getFirelord<Example>(db, 'colName').doc(`a${suffix}`) // type error, type is string!
