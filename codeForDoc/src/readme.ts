import {
	getFirelord,
	getFirestore,
	MetaTypeCreator,
	serverTimestamp,
	ServerTimestamp,
	setDoc,
	where,
	query,
	getDoc,
	Timestamp, // firestore timestamp
} from 'firelordjs'

type Example = MetaTypeCreator<
	{
		abc: ServerTimestamp // declare the key `abc` a server timestamp
	},
	'SomeCollectionName'
>
const db = getFirestore()
const example = getFirelord<Example>(db, 'SomeCollectionName')

// In write operation, Firelord does not convert ServerTimestamp
setDoc(example.doc('SomeDocName'), { abc: serverTimestamp() })
// you can only write server timestamp to abc
// @ts-expect-error
setDoc(example.doc('SomeDocName'), { abc: Timestamp.now() })
// @ts-expect-error
setDoc(example.doc('SomeDocName'), { abc: new Date() })

// In query operation, Firelord converts ServerTimestamp to Timestamp | Date
query(example.collection(), where('abc', '<', new Date()))
query(example.collection(), where('abc', '<', Timestamp.now()))
// you can only compare to Timestamp | Date
// @ts-expect-error
query(example.collection(), where('abc', '<', serverTimestamp()))

// In read operation, Firelord converts ServerTimestamp to Timestamp
getDoc(example.doc('SomeDocName')).then(snapshot => {
	const data = snapshot.data()
	if (data) {
		const a = data.abc
		//    ^?
	}
})
