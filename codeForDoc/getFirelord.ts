import {
	getDoc,
	MetaTypeCreator,
	getFirelord,
	ServerTimestamp,
} from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number
		b: {
			c: number
			d: ServerTimestamp // server timestamp
		}
	},
	'abc',
	string
>

const firelord = getFirelord()

const docRef = firelord<abc>('abc').doc('efg')

getDoc(docRef).then(docSnapshot => {
	const data = docSnapshot.data({ serverTimestamps: 'none' })
	if (data) {
		const timestamp = data.b.d // bad: should be null | FieldValue
	}
})
