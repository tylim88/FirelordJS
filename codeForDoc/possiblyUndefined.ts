import {
	setDoc,
	getDoc,
	MetaTypeCreator,
	getFirelord,
	PossiblyReadAsUndefined,
} from 'firelordjs'

const firelord = getFirelord()

type abc = MetaTypeCreator<
	{
		a: number | PossiblyReadAsUndefined
		b: number
	},
	'abc',
	string
>

const docRef = firelord<abc>('abc').doc('efg')

getDoc(docRef).then(docSnap => {
	//
	//
	//
	//
	//
	//
	//
	//
	//
	const data = docSnap.data()
})

type abc2 = MetaTypeCreator<
	{
		a: number
		b: number
	},
	'abc',
	string,
	undefined, // no parent
	{ allFieldsPossiblyUndefined: true }
>

const docRef2 = firelord<abc2>('abc').doc('efg')

getDoc(docRef2).then(docSnap => {
	//
	//
	//
	//
	//
	//
	//
	//
	//
	const data = docSnap.data()
})

type abc3 = MetaTypeCreator<
	{
		a: PossiblyReadAsUndefined[]
		b: { c: PossiblyReadAsUndefined }[]
	},
	'abc',
	string
>

const docRef3 = firelord<abc3>('abc').doc('efg')

getDoc(docRef3).then(docSnap => {
	const data = docSnap.data()
	if (data) {
		const {
			//
			//
			//
			//
			//
			//
			//
			a,
			b,
		} = data
	}
})

type abc4 = MetaTypeCreator<
	{
		a: number[] | PossiblyReadAsUndefined
		b: { c: PossiblyReadAsUndefined }[]
	},
	'abc',
	string
>

const docRef4 = firelord<abc4>('abc').doc('efg')

getDoc(docRef4).then(docSnap => {
	const data = docSnap.data()
	if (data) {
		const {
			//
			//
			//
			//
			//
			//
			//
			a,
			b,
		} = data
	}
})

type abc5 = MetaTypeCreator<
	{
		a: number | PossiblyReadAsUndefined
		b: PossiblyReadAsUndefined
	},
	'abc',
	string
>

const docRef5 = firelord<abc5>('abc').doc('efg')
//
//
setDoc(docRef5, {
	a: 1,
	// @ts-expect-error
	b: 2,
})
