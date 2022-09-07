import { MetaTypeCreator, getFirelord } from 'firelordjs'

type Example = MetaTypeCreator<
	{
		a: number
	},
	'colName',
	string
>

type ExampleChild = MetaTypeCreator<
	{
		b: string
	},
	'childColName',
	string,
	Example
>

const someDocId = 'someDocId'
//
//
//
//
const exampleChild = getFirelord<ExampleChild>()(
	// @ts-expect-error
	'colName' + someDocId + 'childColName'
) // type error, type is string!

const exampleChild2 = getFirelord<ExampleChild>()(
	`colName/${someDocId}/childColName`
) // ok, type is `colName/someDocId/childColName`!
