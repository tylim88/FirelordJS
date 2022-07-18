import {
	setDoc,
	getDoc,
	MetaTypeCreator,
	getFirelord,
	PossiblyReadAsUndefined,
} from 'firelordjs'

type abc = MetaTypeCreator<
	{
		a: number | PossiblyReadAsUndefined
		b: number
	},
	'abc',
	string
>

const docRef = getFirelord<abc>()('abc').doc('efg')

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
		b: { c: number; d: { e: number }[] }
	},
	'abc',
	string,
	null, // no parent
	{ allFieldsPossiblyReadAsUndefined: true }
>

const docRef2 = getFirelord<abc2>()('abc').doc('efg')

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
	},
	'abc',
	string
>

const docRef3 = getFirelord<abc3>()('abc').doc('efg')

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

const docRef4 = getFirelord<abc4>()('abc').doc('efg')

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

const docRef5 = getFirelord<abc5>()('abc').doc('efg')

setDoc(docRef5, {
	//
	//
	//
	//
	//
	//
	//
	a: 1, // @ts-expect-error
	b: undefined,
})
