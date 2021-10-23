import { firelord } from '.'

import { Firelord } from './firelord'
import { firestore } from 'firebase-admin'

// use base type to generate read and write type
type User = Firelord.ReadWriteCreator<
	{
		name: string
		age: number
		birthday: Date
		joinDate: 'ServerTimestamp'
		beenTo: ('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[]
	}, // base type
	'Users', // collection path type
	string // document path type
>

// read type
type UserRead = User['read'] // {name: string, age:number, birthday:firestore.Timestamp, joinDate: firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

// write type
type UserWrite = User['write'] // {name: string, age:number|FirebaseFirestore.FieldValue, birthday:firestore.Timestamp | Date, joinDate:FirebaseFirestore.FieldValue, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[] | FirebaseFirestore.FieldValue, createdAt:'ServerTimestamp', updatedAt:'ServerTimestamp'}

// compare type
type UserCompare = User['compare'] // {name: string, age:number, birthday:Date | firestore.Timestamp, joinDate: Date | firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

type colPath = User['colPath']

// implement wrapper
const userCreator = firelord<User>()
// collection reference
const users = userCreator.col('Users') // collection path type is "Users"
// collection group reference
const userGroup = userCreator.colGroup('Users') // collection path type is "Users"
// user reference
const user = users.doc('1234567890') // document path is string

// subCollection of User
type Transaction = Firelord.ReadWriteCreator<
	{
		amount: number
		date: 'ServerTimestamp'
		status: 'Fail' | 'Success'
	}, // base type
	'Transactions', // collection path type
	string, // document path type
	User // insert parent collection, it will auto construct the collection path for you
>

// implement the wrapper
const transactions = firelord<
	Firelord.ReadWriteCreator<
		{
			amount: number
			date: 'ServerTimestamp'
			status: 'Fail' | 'Success'
		}, // base type
		'Transactions', // collection path type
		string, // document path type
		User // insert parent collection, it will auto construct the collection path for you
	>
>().col('Users/283277782/Transactions') // the type for col is `User/${string}/Transactions`
const transaction = users.doc('1234567890') // document path is string

user.get().then(snapshot => {
	const data = snapshot.data()
})

user.onSnapshot(snapshot => {
	const data = snapshot.data()
})

const serverTimestamp = firestore.FieldValue.serverTimestamp()

// create if only exist, else fail
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.create({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else overwrite
// although it can overwrite, this is intended to use as create
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else update
// although it can create if not exist, this is intended to use as update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `{ merge:true }` in option as shown below.
user.set({ name: 'Michael' }, { merge: true })

// create if not exist, else update
// although it can create if not exist, this is intended to use as update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
// the merge keys are keys of `base type`
// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `mergeField: [<keys>]` in option as shown below.
user.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
user.update({ name: 'Michael' })

// delete document
user.delete()

user.runTransaction(async transaction => {
	// get `read type` data
	await transaction.get().then(snapshot => {
		const data = snapshot.data()
	})

	// create if only exist, else fail
	// require all members in `write type` except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	await transaction.create({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: serverTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else overwrite
	// although it can overwrite, this is intended to use as create
	// require all members in `write type` except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	user.set({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: serverTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else update
	// although it can create if not exist, this is intended to use as update
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
	// auto update `updatedAt`
	// the only value for `merge` is `true`
	// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `{ merge:true }` in option as shown below.
	await transaction.set({ name: 'Michael' }, { merge: true })

	// create if not exist, else update
	// although it can create if not exist, this is intended to use as update
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
	// auto update `updatedAt`
	// the merge keys are keys of `base type`
	// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `mergeField: [<keys>]` in option as shown below.
	await transaction.set(
		{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
		{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
	)

	// update if exist, else fail
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
	// auto update `updatedAt`
	await transaction.update({ name: 'Michael' })
	// delete document
	await transaction.delete()

	// keep in mind you need to return promise in transaction
	// example code here is just example to show api, this is not the correct way to do it
	// refer back firestore guide https://firebase.google.com/docs/firestore/manage-data/transactions
	return Promise.resolve('')
})

// the field path is the keys of the `compare type`
// if the member value is non array, type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
// if type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>', the value type is same as the member's type in `compare type`
users.where('name', '==', 'John').get()
// if type of opStr is 'not-in' | 'in', the value type is array of member's type in `compare type`
users.where('name', 'in', ['John', 'Michael']).get()

// the field path is the keys of the `compare type`
// if the member value type is array, type of `opStr` is  'in' | 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()

// orderBy field path only include members that is NOT array type in `compare type`
users.orderBy('name', 'desc').limit(3).get()

// you can chain `orderBy` claus with SAME field path as `where` clause if the comparator is `!=`
users.where('age', '!=', 20).orderBy('age', 'desc').get()
// you can chain `orderBy` claus with DIFFERENT field path as `where` clause if the comparator is `array-contains` or `array-contains-any`
users.where('beenTo', 'array-contains', 'USA').orderBy('age', 'desc').get()
users
	.where('beenTo', 'array-contains-any', ['USA', 'CHINA'])
	.orderBy('age', 'desc')
	.get()

// You cannot order your query by any field included in an equality `==` or `in` clause
// https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations
users.where('age', '==', 20).orderBy('age', 'desc').get() // ERROR: Property 'orderBy' does not exist
users.where('age', 'in', [20, 30]).orderBy('age', 'desc').get() // ERROR: Property 'orderBy' does not exist

// the first orderBy must have the same field path as `where` clause with <, <=, >, >= comparators
// https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations
// whenever <, <=, >, >= comparators is used, they cannot chain the first orderBy, you need to use type safe shorthand shown in example below
users.where('age', '>', 20).orderBy('name', 'desc').get() // ERROR: Property 'orderBy' does not exist
// this is also invalid according to firestore nor it make any sense

// we prepare type safe shorthand to handle <, <=, >, >= comparators
// for <, <=, >, >= comparators, the optional 4th parameter(orderBy config object) is available, else the 4th parameter's type is `never`(should not exist)
// field value type is the corresponding field path value type in `compare type`
users.where('age', '>', 20, {}).get() // equivalent to where('age', '>', 20).orderBy('age') or where('age', '>', 20).orderBy('age','asc')
users.where('age', '<=', 20, { directionStr: 'desc' }).get() // equivalent to where('age', '>', 20).orderBy('age','desc')
users
	.where('age', '>=', 20, {
		directionStr: 'desc',
		cursor: { clause: 'endAt', fieldValue: 50 },
	})
	.get() // equivalent to where('age', '>', 20).orderBy('age','desc').endAt(50)

// you of course not able to use `==` and `in` comparator in shorthand as stated in limitation
users.where('age', '==', 20, { directionStr: 'desc' }).get() // ERROR: Argument of type '{}' is not assignable to parameter of type 'undefined'
users.where('age', 'in', [20], { directionStr: 'desc' }).get() // ERROR: Argument of type '{}' is not assignable to parameter of type 'undefined'

// for `not-in` comparator, optional `fieldPath` config member is available in the 4th parameter, (else the config member's type is `never`)
// if `fieldPath` is undefined, it will use the same `fieldPath` as where clause
// field value type is the corresponding field path value type in `compare type`
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'age',
		directionStr: 'desc',
		cursor: { clause: 'endAt', fieldValue: 50 },
	})
	.get()

users.orderBy('age', 'asc', { clause: 'startAt', fieldValue: 20 }).offset(5)
