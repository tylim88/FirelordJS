import { updateDoc } from './updateDoc'

import {
	userRefCreator,
	initializeApp,
	writeThenReadTest,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { setDoc } from './setDoc'
import {
	arrayUnion,
	serverTimestamp,
	deleteField,
	increment,
} from '../fieldValue'
import { Update, IsTrue, IsSame, ErrorUnknownMember } from '../types'

initializeApp()
const userRef = userRefCreator()
// type test here include all type test of batch and transaction because it is the same type
describe('test updateDoc', () => {
	it('test whether the return type is correct', () => {
		type A = typeof updateDoc
		type B = Update
		IsTrue<IsSame<A, B>>()
	})
	it('test wrong type', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				// @ts-expect-error
				beenTo: [{}],
				// @ts-expect-error
				name: true,
				// @ts-expect-error
				role: 'admi1n',
				// @ts-expect-error
				age: '3',
			})
	})
	it('test undefined type, should reject undefined', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				// @ts-expect-error
				beenTo: undefined,
				// @ts-expect-error
				name: undefined,
				// @ts-expect-error
				role: undefined,
				// @ts-expect-error
				age: undefined,
			})
	})
	it('test missing member, missing should be fine', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				beenTo: [{ China: ['Guangdong'] }],
				name: 'abc',
				'a.b.c': increment(1),
				'a.b.f': [],
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor',
				age: 1,
				beenTo: [],
			})
	})
	it('test missing member with wrong type', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				// @ts-expect-error
				beenTo: [{ China: ['Guangd1ong'] }],
				name: 'abc',
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor',
				// @ts-expect-error
				ag2e: 1,
			})
	})
	const ag2e = 'ag2e' as const
	const errorUnknownMember: ErrorUnknownMember<
		typeof ag2e
	> = `Error: Please remove the unknown member ( ${ag2e} )`

	it('test unknown member', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor',
				// @ts-expect-error
				[ag2e]: 1,
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor',
				// @ts-expect-error
				[ag2e]: errorUnknownMember,
			})
	})
	it('test unknown member with stale value', () => {
		const stale = {
			role: 'visitor',
			[ag2e]: 1,
		}
		;() =>
			updateDoc(
				userRef.doc('123'),
				// @ts-expect-error
				stale
			)
		const stale2 = {
			role: 'visitor',
			[ag2e]: errorUnknownMember,
		}
		;() =>
			updateDoc(
				userRef.doc('123'),
				// @ts-expect-error
				stale2
			)
	})
	it('test empty object literal data', () => {
		// @ts-expect-error
		;() => updateDoc(userRef.doc('123'), {})
		;() =>
			updateDoc(userRef.doc('123'), {
				// @ts-expect-error
				a: {},
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				a: {
					// @ts-expect-error
					i: {},
				},
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				// @ts-expect-error
				'a.i': {},
			})
	})
	it('test hybrid correct type', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor' as const,
				age: increment(1),
				a: { e: arrayUnion(...['1']), 'b.c': 1 },
				'a.k': serverTimestamp(),
			})
	})
	it('test hybrid wrong type', () => {
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor' as const,
				age: 1,
				// @ts-expect-error
				a: { e: arrayUnion([1]) },
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor' as const,
				age: 1,
				// @ts-expect-error
				a: { 'e.h': arrayUnion(['abc']) },
			})
		;() =>
			updateDoc(userRef.doc('123'), {
				role: 'visitor' as const,
				age: 1,
				// @ts-expect-error
				a: { 'e.1': arrayUnion(['a']) },
			})
	})
	it('test hybrid correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = {
			role: 'visitor' as const,
			age: increment(1),
			a: { e: arrayUnion(...['1']), 'b.c': 1 },
			'a.k': serverTimestamp(),
			unknown: '123',
		}
		;() =>
			updateDoc(
				userRef.doc('123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test full correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = { ...generateRandomData(), unknown: '123' }
		;() =>
			updateDoc(
				userRef.doc('123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test functionality', async () => {
		await writeThenReadTest(async data => {
			const ref = userRef.doc('updateDocTestCase')
			await setDoc(ref, generateRandomData())
			await updateDoc(ref, data)
			return ref
		})
	})
	it('test same path, delete field, in hybrid', async () => {
		const data = generateRandomData()
		const ref = userRef.doc('updateDocSpecificFieldTestCase')
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await updateDoc(ref, {
			a: { 'i.j': deleteField() },
			'a.b': { f: arr },
			'a.b.c': num,
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await readThenCompareWithWriteData(data, ref)
	})
})
