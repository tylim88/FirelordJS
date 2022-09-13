import { MetaTypeCreator, getFirelord } from 'firelordjs'

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
const docRef = getFirelord<Example>('colName').doc(
	// @ts-expect-error
	'a' + suffix
) // type error, type is string!

const docRef2 = getFirelord<Example>('colName').doc(`a${suffix}`) // type error, type is string!
