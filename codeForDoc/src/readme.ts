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
		a: ServerTimestamp
	},
	'SomeCollectionName'
>
const db = getFirestore()
const example = getFirelord<Example>(db, 'SomeCollectionName')

// In write operation, Firelord does not convert ServerTimestamp
setDoc(example.doc('SomeDocName'), { a: serverTimestamp() })
// In query operation, Firelord converts ServerTimestamp to Timestamp | Date
query(example.collection(), where('a', '<', new Date()))
query(example.collection(), where('a', '<', Timestamp.now()))
// In read operation, Firelord converts ServerTimestamp to Timestamp
getDoc(example.doc('SomeDocName')).then(snapshot => {
	const data = snapshot.data()
	if (data) {
		const a = data.a // Timestamp
	}
})
