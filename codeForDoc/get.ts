import {
	getDoc,
	doc,
	getFirestore,
	DocumentReference,
	FieldValue,
} from 'firebase/firestore'

type abc = DocumentReference<{
	a: number
	b: {
		c: number
		d: FieldValue // server timestamp
	}
}>

const docRef = doc(getFirestore(), 'abc/efg') as abc

getDoc(docRef).then(docSnapshot => {
	const data = docSnapshot.data({ serverTimestamps: 'none' })
	if (data) {
		const timestamp = data.b.d // bad: should be null | FieldValue
	}
})
