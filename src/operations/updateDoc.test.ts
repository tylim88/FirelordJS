import { updateDoc } from './updateDoc'
import { deleteDoc } from './deleteDoc'
import {
	userRefCreator,
	initializeApp,
	writeThenCompareWithRead,
	generateRandomData,
	readThenCompareWithWriteData,
	User,
} from '../utilForTests'
import { setDoc } from './setDoc'
import {
	arrayUnion,
	serverTimestamp,
	deleteField,
	increment,
} from '../fieldValue'
import {
	Update,
	IsTrue,
	IsSame,
	ErrorUnknownMember,
	DeepPartial,
} from '../types'

initializeApp()
// type test here include all type test of batch and transaction because it is the same type
describe('test updateDoc', () => {
	it('test whether the return type is correct', () => {
		type A = typeof updateDoc
		type B = Update
		IsTrue<IsSame<A, B>>()
	})
	it('test wrong type', () => {
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
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

	it('test accept optional type, must turn on exactOptionalPropertyTypes config', () => {
		const a = {} as unknown as DeepPartial<User['writeFlatten']>

		;() => updateDoc(userRefCreator().doc('FirelordTest', '123'), a)
	})
	it('test undefined type, should reject undefined', () => {
		;() =>
			updateDoc(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				{
					beenTo: undefined,
					name: undefined,
					role: undefined,
					age: undefined,
				}
			)
	})
	it('test missing member, missing should be fine', () => {
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				beenTo: [{ China: ['Guangdong'] }],
				name: 'abc',
				'a.b.c': increment(1),
				'a.b.f': [],
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				age: 1,
				beenTo: [],
			})
	})
	it('test missing member with wrong type', () => {
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				// @ts-expect-error
				beenTo: [{ China: ['Guangd1ong'] }],
				name: 'abc',
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
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
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				// @ts-expect-error
				[ag2e]: 1,
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
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
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				stale
			)
		const stale2 = {
			role: 'visitor',
			[ag2e]: errorUnknownMember,
		}
		;() =>
			updateDoc(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				stale2
			)
	})
	it('test empty object literal data', () => {
		// @ts-expect-error
		;() => updateDoc(userRefCreator().doc('123'), {})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				// @ts-expect-error
				a: {},
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				a: {
					// @ts-expect-error
					i: {},
				},
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				// @ts-expect-error
				'a.i': {},
			})
	})
	it('test hybrid correct type', () => {
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor' as const,
				age: increment(1),
				a: { e: arrayUnion(...['1']), 'b.c': 1 },
				'a.k': serverTimestamp(),
			})
	})
	it('test hybrid wrong type', () => {
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor' as const,
				age: 1,
				// @ts-expect-error
				a: { e: arrayUnion([1]) },
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor' as const,
				age: 1,
				// @ts-expect-error
				a: { 'e.h': arrayUnion(['abc']) },
			})
		;() =>
			updateDoc(userRefCreator().doc('FirelordTest', '123'), {
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
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test full correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = { ...generateRandomData(), unknown: '123' }
		;() =>
			updateDoc(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test functionality', async () => {
		await writeThenCompareWithRead(async data => {
			const ref = userRefCreator().doc('FirelordTest', 'updateDocTestCase')
			await setDoc(ref, generateRandomData())
			await updateDoc(ref, data)
			return ref
		})
	})
	it('test functionality with overload', async () => {
		await writeThenCompareWithRead(async data => {
			const ref = userRefCreator().doc('FirelordTest', 'updateDocTestCase')
			await setDoc(ref, generateRandomData())
			await updateDoc(ref, data)
			return ref
		})
	})
	it('test same path, delete field, in hybrid', async () => {
		const data = generateRandomData()
		const ref = userRefCreator().doc(
			'FirelordTest',
			'updateDocSpecificFieldTestCase'
		)
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
	it('test update non-existing doc', async () => {
		const docRef = userRefCreator().doc('FirelordTest', 'updateEmptyData')
		deleteDoc(docRef)
		expect.assertions(1)
		try {
			await updateDoc(
				docRef,
				// @ts-expect-error
				{}
			)
		} catch (e) {
			expect(true).toBe(true)
		}
	})
})
