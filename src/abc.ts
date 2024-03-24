import {
	getFirelord,
	MetaTypeCreator,
	getFirestore,
	query,
	orderBy,
	where,
} from './index'

type A = MetaTypeCreator<{ a: number; b: string }, 'A'>

const a = getFirelord<A>(getFirestore(), 'A')

const q1 = query(a.collection(), where('a', '==', 1), orderBy('b'))

const q2 = query(a.collection(), orderBy('b'), where('a', '==', 1))
