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

const someNumericDocId = 12345
//
//
//
//
const exampleChild = getFirelord<ExampleChild>()(
	// @ts-expect-error
	'colName' + someNumericDocId.toString() + 'childColName'
) // type error, type is string!

const exampleChild2 = getFirelord<ExampleChild>()(
	`colName/${someNumericDocId}/childColName`
) // ok, type is `colName/12345/childColName`!
