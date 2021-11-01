import { firelord } from '.'

import { Firelord } from './firelord'
import { flatten } from './utils'
// import firebase from 'firebase'
// import 'firebase/firestore'

import firebase from 'firebase/compat/app' // firebase 9
import 'firebase/compat/firestore' // firebase 9

firebase.initializeApp({
	apiKey: '### FIREBASE API KEY ###',
	authDomain: '### FIREBASE AUTH DOMAIN ###',
	projectId: '### CLOUD FIRESTORE PROJECT ID ###',
})

const firestore = firebase.firestore

// create wrapper
const wrapper = firelord(firestore)

const { increment, arrayUnion, serverTimestamp } = wrapper().fieldValue

// use base type to generate read and write type
type User = Firelord.ReadWriteCreator<
	{
		name: string
		age: number
		birthday: Date
		joinDate: Firelord.ServerTimestamp
		beenTo: ('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[]
	}, // base type
	'Users', // collection path type
	string // document path type
>
type aaa<
	E extends { colPath: string; docID: string } = {
		colPath: '1234567890'
		docID: '1234567890'
	}
> = E extends {
	colName: '1234567890'
	docID: '1234567890'
}
	? '123'
	: `${E['colPath']}/${E['docID']}/${'123'}`

type ccc = aaa

// read type
type UserRead = User['read'] // {name: string, age:number, birthday:firestore.Timestamp, joinDate: firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

// write type
type UserWrite = User['write'] // {name: string, age:number|FirebaseFirestore.FieldValue, birthday:firestore.Timestamp | Date, joinDate:FirebaseFirestore.FieldValue, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[] | FirebaseFirestore.FieldValue, createdAt:Firelord.ServerTimestamp, updatedAt:Firelord.ServerTimestamp}

// compare type
type UserCompare = User['compare'] // {name: string, age:number, birthday:Date | firestore.Timestamp, joinDate: Date | firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

// collection name
type UserColName = User['colName'] //"Users"

// collection path
type UserColPath = User['colPath'] // "Users"

// document ID
type UserDocId = User['docID'] // string

// documentPath
type UserDocPath = User['docPath']

// implement wrapper
const userCreator = wrapper<User>()
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
		date: Firelord.ServerTimestamp
		status: 'Fail' | 'Success'
	}, // base type
	'Transactions', // collection path type
	string, // document path type
	User // insert parent collection, it will auto construct the collection path for you
>

// implement the wrapper
const transactions = wrapper<
	Firelord.ReadWriteCreator<
		{
			amount: number
			date: Firelord.ServerTimestamp
			status: 'Fail' | 'Success'
		}, // base type
		'Transactions', // collection path type
		string, // document path type
		User // insert parent collection, it will auto construct the collection path for you
	>
>().col('Users/283277782/Transactions') // the type for col is `User/${string}/Transactions`
const transactionGroup = wrapper<Transaction>().colGroup('Transactions') // the type for collection group is `Transactions`
const transaction = users.doc('1234567890') // document path is string

user.get().then(snapshot => {
	const data = snapshot.data()
})

user.onSnapshot(snapshot => {
	const data = snapshot.data()
})

// create if not exist, else overwrite
// although it can overwrite, this is intended to use as create
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp(),
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

	// create if not exist, else overwrite
	// although it can overwrite, this is intended to use as create
	// require all members in `write type` except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	user.set({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: serverTimestamp(),
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

// the field path is the keys of the `compare type`(basically keyof base type plus `createdAt` and `updatedAt`)

// if the member value type is array, type of `opStr` is  'in' | 'array-contains'| 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()

// orderBy field path only include members that is NOT array type in `compare type`
users.orderBy('name', 'desc').limit(3).get()
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

// for `array-contains` and `array-contains-any` comparators, you can chain `orderBy` claus with DIFFERENT field path
users.where('beenTo', 'array-contains', 'USA').orderBy('age', 'desc').get()
users
	.where('beenTo', 'array-contains-any', ['USA', 'CHINA'])
	.orderBy('age', 'desc')
	.get()

// for '==' | 'in' comparators:
// no order for '==' | 'in' comparator for SAME field name
users.where('age', '==', 20).orderBy('age', 'desc').get()
// '==' | 'in' is order-able with DIFFERENT field name but need to use SHORTHAND form to ensure type safety
users.where('age', '==', 20).orderBy('name', 'desc').get()
// shorthand ensure type safety, equivalent to where('age', '>', 20).orderBy('name','desc')
users.where('age', '==', 20, { fieldPath: 'name', directionStr: 'desc' }).get()
// again, no order for '==' | 'in' comparator for SAME field name
users.where('age', '==', 20, { fieldPath: 'age', directionStr: 'desc' }).get()

// for '<' | '<=]| '>'| '>=' comparator
// no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20).orderBy('name', 'desc').get()
// '<' | '<=]| '>'| '>=' is oder-able with SAME field name but need to use SHORTHAND form to ensure type safety
users.where('age', '>', 20).orderBy('age', 'desc').get()
// equivalent to where('age', '>', 20).orderBy('age','desc')
users.where('age', '>', 20, { fieldPath: 'age', directionStr: 'desc' }).get()
// again, no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20, { fieldPath: 'name', directionStr: 'desc' }).get()

// for `not-in` and `!=` comparator, you can use normal and  shorthand form for both same and different name path
// same field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('name', 'desc').get()
// different field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('age', 'desc').get()
// shorthand different field path:
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'age',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('age','desc')
// shorthand same field path:
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'name',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('name','desc')

// same field path
users.where('name', '!=', 'John').orderBy('name', 'desc').get()
// different field path
users.where('name', '!=', 'John').orderBy('age', 'desc').get()
// shorthand different field path:
users
	.where('name', '!=', 'John', {
		fieldPath: 'age',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc')
// shorthand same field path:
users
	.where('name', '!=', 'John', {
		fieldPath: 'name',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('name','desc')

//pagination
// field path only include members that is NOT array type in `base type`
// field value type is the corresponding field path value type in `compare type`
// value of cursor clause is 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
users.orderBy('age', 'asc', { clause: 'startAt', fieldValue: 20 }).offset(5) // equivalent to orderBy("age").startAt(20).offset(5)
// usage with where
users
	.where('name', '!=', 'John')
	.orderBy('age', 'desc', { clause: 'endAt', fieldValue: 50 })
// equivalent to shorthand
users
	.where('name', '!=', 'John', {
		fieldPath: 'age',
		directionStr: 'desc',
		cursor: { clause: 'endAt', fieldValue: 50 },
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc').endAt(50)

// quick doc
users.where('age', '!=', 20).orderBy('age', 'desc').get() // ok
users.where('age', 'not-in', [20]).orderBy('age', 'desc').get() // ok
users.where('age', '!=', 20).orderBy('beenTo', 'desc').get() // no order for array

// no order for '==' | 'in' comparator for SAME field name
users.where('age', '==', 20).orderBy('age', 'desc').get()
// '==' | 'in' is order-able with DIFFERENT field name but need to use SHORTHAND form to ensure type safety
users.where('age', '==', 20).orderBy('name', 'desc').get()
// shorthand ensure type safety, equivalent to where('age', '>', 20).orderBy('name','desc')
users.where('age', '==', 20, { fieldPath: 'name', directionStr: 'desc' }).get()
// again, no order for '==' | 'in' comparator for SAME field name
users.where('age', '==', 20, { fieldPath: 'age', directionStr: 'desc' }).get()

// no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20).orderBy('name', 'desc').get()
// '<' | '<=]| '>'| '>=' is oder-able with SAME field name but need to use SHORTHAND form to ensure type safety
users.where('age', '>', 20).orderBy('age', 'desc').get()
// equivalent to where('age', '>', 20).orderBy('age','desc')
users.where('age', '>', 20, { fieldPath: 'age', directionStr: 'desc' }).get()
// again, no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20, { fieldPath: 'name', directionStr: 'desc' }).get()

// only 1 limit or limitToLast and 1 offset
users.limit(1).where('age', '!=', 20).limitToLast(2)
users.limit(1).where('age', '!=', 20).limit(2)
users.offset(1).where('age', '!=', 20).offset(2)
users.where('age', '!=', 20).limitToLast(2).offset(3).limit(1)

type a = Firelord.ReadWriteCreator<
	{
		a:
			| string
			| Date
			| number[]
			| (string | number)[]
			| (string | Date)[][]
			| (string | number)[][][]
	},
	string,
	string
>

type b = a['write']
type c = a['read']
type f = a['compare']

type a1 = Firelord.ReadWriteCreator<
	{
		a: string | Date
		b: { c: 1; d: 2 }
	},
	string,
	string
>

type b1 = a1['write']
type c1 = a1['read']
type f1 = a1['compare']

type e1 = b1['b.c']

type x = Nested['read']
type y = Nested['write']
type z = Nested['compare']

type Nested = Firelord.ReadWriteCreator<
	{
		a: number
		b: { c: string }
		d: { e: { f: Date[]; g: { h: { i: { j: Date }[] }[] } } }
	},
	'Nested',
	string
>
const nested = wrapper<Nested>().col('Nested')

// read type, does not flatten because no need to
type NestedRead = Nested['read'] // {a: number, b: { c: string }, d: { e: { f: FirebaseFirestore.Timestamp[], g: { h: { i: {j: firestore.Timestamp}[] }[] } } }	}
// write type
type NestedWrite = Nested['write']['d.e.g.h'] // {a: number | FirebaseFirestore.FieldValue, "b.c": string, "d.e.f": FirebaseFirestore.FieldValue | (FirebaseFirestore.Timestamp | Date)[], "d.e.g.h": FirebaseFirestore.FieldValue | { i: {j: firestore.Timestamp | Date}[] }[], createdAt: FirebaseFirestore.FieldValue, updatedAt: FirebaseFirestore.FieldValue}

// compare type
type NestedCompare = Nested['compare'] // {a: number, "b.c": string, "d.e.f": (FirebaseFirestore.Timestamp | Date)[], "d.e.g.h": FirebaseFirestore.FieldValue | { i: {j: firestore.Timestamp | Date}[] }[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}
const incorrectData = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: true }] }] } } },
}

const completeData = {
	a: 1,
	b: { c: 'abc' },
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}

const incorrectCompleteData = {
	a: 1,
	b: { c: 'abc' },
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: true }] }] } } },
}

nested.doc('123456').set(completeData)
nested.doc('123456').set(data, { merge: true })
nested.doc('123456').update(flatten(data))

nested.doc('123456').set(data) // not ok, need complete data if no merge option
nested.doc('123456').set(incorrectCompleteData)
nested.doc('123456').set(incorrectData, { merge: true })
nested.doc('123456').update(flatten(incorrectData))

type Example = Firelord.ReadWriteCreator<
	{
		aaa: number | undefined
		bbb: Firelord.ServerTimestamp
		ddd: string[]
		eee: {
			fff: {
				ggg: boolean
				jjj: number
				kkk: { lll: Date | undefined; mmm: boolean }[]
			}[]
		}
	},
	'Example',
	string
>

const example = wrapper<Example>().col('Example')

example.doc('1234567').update({
	aaa: 1,
}) // ok

example.doc('1234567').update({
	aaa: 1,
	zzz: 'stranger member',
}) // reject stranger member

example.doc('1234567').update(
	flatten({
		aaa: 1,
		eee: {
			fff: [{ ggg: true, jjj: 1, kkk: [{ lll: new Date(0), mmm: true }] }],
		},
	})
) // ok, complex data

example.doc('1234567').update(
	flatten({
		aaa: 1,
		bbb: serverTimestamp(),
		eee: {
			fff: [
				{
					ggg: true,
					jjj: 1,
					kkk: [{ lll: new Date(0), mmm: true, zzz: 'stranger member' }],
				},
			],
		},
	})
) // reject stranger member in complex data regardless of depth

// set ok
example.doc('1234567').set({
	aaa: 1,
	bbb: serverTimestamp(),
	ddd: [],
	eee: {
		fff: [
			{
				ggg: true,
				jjj: 1,
				kkk: [{ lll: new Date(0), mmm: true }],
			},
		],
	},
})
// set merge ok
example.doc('1234567').set(
	{
		aaa: 1,
		bbb: serverTimestamp(),
		eee: {
			fff: [
				{
					ggg: true,
					jjj: 1,
					kkk: [{ lll: new Date(0), mmm: true }],
				},
			],
		},
	},
	{ merge: true }
)

// set not ok
example.doc('1234567').set({
	aaa: 1,
	bbb: serverTimestamp(),
	ddd: [],
	eee: {
		fff: [
			{
				ggg: true,
				jjj: !1,
				kkk: [{ lll: new Date(0), mmm: true }],
			},
		],
	},
})
// set merge not ok
example.doc('1234567').set(
	{
		aaa: 1,
		bbb: serverTimestamp(),
		eee: {
			fff: [
				{
					ggg: true,
					jjj: !1,
					kkk: [{ lll: new Date(0), mmm: true }],
				},
			],
		},
	},
	{ merge: true }
)

example.doc('1234567').update({
	aaa: undefined, // ok, a: number | undefined
	ddd: undefined, // Error, d: string[]
}) // reject undefined

example.doc('1234567').update(
	flatten({
		aaa: 1,
		eee: {
			fff: [{ ggg: true, jjj: 1, kkk: [{ lll: undefined, mmm: true }] }],
		}, // ok, because lll: undefined | Date
	})
)

example.doc('1234567').update(
	flatten({
		aaa: 1,
		eee: {
			fff: [{ ggg: true, jjj: 1, kkk: [{ lll: new Date(0), mmm: undefined }] }],
		}, // not ok because mmm: boolean
	})
) // complex data reject undefined regardless of depth

example.doc('1234567').update({
	aaa: serverTimestamp(), // ERROR
	bbb: increment(11), // ERROR
	ddd: arrayUnion(123, 456), // ERROR
})

example.doc('1234567').update({
	aaa: increment(1), // ok
	bbb: serverTimestamp(), // ok
	ddd: arrayUnion('123', '456'), // ok
})
