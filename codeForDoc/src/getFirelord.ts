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

const docRef = getFirelord<abc>()('abc').doc('efg')

getDoc(docRef).then(docSnapshot => {
	const data = docSnapshot.data({ serverTimestamps: 'none' })
	if (data) {
		//
		//
		const timestamp = data.b.d // good: null | Timestamp
	}
})

getDoc(docRef).then(docSnapshot => {
	const data = docSnapshot.data({ serverTimestamps: 'estimate' })
	if (data) {
		//
		//
		const timestamp = data.b.d // good: Timestamp
	}
})

//
//
//
//
//
getDoc(docRef).then(docSnapshot => {
	// @ts-expect-error
	docSnapshot.get('n.j', { serverTimestamps: 'none' })
	// good: reject unknown path!
	//
	//
	//
	//
	//
	//
	const data = docSnapshot.get('b.d', { serverTimestamps: 'none' })
	// good: return correct type!
})
