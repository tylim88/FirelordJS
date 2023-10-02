import { updateDocNoFlatten } from './updateDocNoFlatten'
import { deleteDoc } from './deleteDoc'
import {
	userRefCreator,
	initializeApp,
	writeThenCompareWithRead,
	generateRandomData,
	User,
} from '../utilForTests'
import { setDoc } from './setDoc'
import {
	arrayUnion,
	serverTimestamp,
	deleteField,
	increment,
} from '../fieldValues'
import {
	UpdateNoFlatten,
	IsTrue,
	IsSame,
	ErrorUnknownMember,
	DeepPartialExceptArray,
} from '../types'

initializeApp()
// type test here include all type test of batch and transaction because it is the same type
describe('test updateDocNoFlatten', () => {
	it('test whether the return type is correct', () => {
		type A = typeof updateDocNoFlatten
		type B = UpdateNoFlatten
		IsTrue<IsSame<A, B>>()
	})
	it('test wrong type', () => {
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
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
		const a = {} as unknown as DeepPartialExceptArray<User['writeFlatten']>

		;() => updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), a)
	})
	it('test undefined type, should reject undefined', () => {
		;() =>
			updateDocNoFlatten(
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
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				beenTo: [{ China: ['Guangdong'] }],
				name: 'abc',
				'a.b.c': increment(1),
				'a.b.f': [],
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				age: 1,
				beenTo: [],
			})
	})
	it('test missing member with wrong type', () => {
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				// @ts-expect-error
				beenTo: [{ China: ['Guangd1ong'] }],
				name: 'abc',
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				// @ts-expect-error
				ag2e: 1,
			})
	})
	const ag2e = 'ag2e'
	const errorUnknownMember: ErrorUnknownMember<
		typeof ag2e
	> = `Error: Please remove the unknown member '${ag2e}'`

	it('test unknown member', () => {
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				// @ts-expect-error
				[ag2e]: 1,
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
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
			updateDocNoFlatten(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				stale
			)
		const stale2 = {
			role: 'visitor',
			[ag2e]: errorUnknownMember,
		}
		;() =>
			updateDocNoFlatten(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				stale2
			)
	})
	it('test empty object literal data, should pass', () => {
		// @ts-expect-error
		;() => updateDocNoFlatten(userRefCreator().doc('123'), {})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				a: {},
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				a: {
					i: {},
				},
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				'a.i': {},
			})
	})
	it('test hybrid correct type', () => {
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				age: increment(1),
				a: { e: arrayUnion(...['1']), 'b.c': 1 },
				'a.k': serverTimestamp(),
			})
	})
	it('test hybrid wrong type', () => {
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				age: 1,
				// @ts-expect-error
				a: { e: arrayUnion([1]) },
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				age: 1,
				// @ts-expect-error
				a: { 'e.h': arrayUnion(['abc']) },
			})
		;() =>
			updateDocNoFlatten(userRefCreator().doc('FirelordTest', '123'), {
				role: 'visitor',
				age: 1,
				// @ts-expect-error
				a: { 'e.1': arrayUnion(['a']) },
			})
	})
	it('test hybrid correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = {
			role: 'visitor',
			age: increment(1),
			a: { e: arrayUnion(...['1']), 'b.c': 1 },
			'a.k': serverTimestamp(),
			unknown: '123',
		} as const
		;() =>
			updateDocNoFlatten(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test full correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = { ...generateRandomData(), unknown: '123' }
		;() =>
			updateDocNoFlatten(
				userRefCreator().doc('FirelordTest', '123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test functionality', async () => {
		await writeThenCompareWithRead(async data => {
			const ref = userRefCreator().doc('FirelordTest', 'updateDocTestCase')
			await setDoc(ref, generateRandomData())
			await updateDocNoFlatten(ref, data)
			return ref
		})
	})
	it('test functionality with overload', async () => {
		await writeThenCompareWithRead(async data => {
			const ref = userRefCreator().doc('FirelordTest', 'updateDocTestCase')
			await setDoc(ref, generateRandomData())
			await updateDocNoFlatten(ref, data)
			return ref
		})
	})
	it('test delete field type', async () => {
		;async () => {
			const ref = userRefCreator().doc(
				'FirelordTest',
				'updateDocSpecificFieldTestCase'
			)
			const date = new Date()
			const arr = [{ g: false, h: date, m: 9 }]
			const num = Math.random()
			await updateDocNoFlatten(ref, {
				age: deleteField(),
				a: {
					// cannot assign delete field in nested property of non-flatten operation data
					// @ts-expect-error
					'i.j': deleteField(),
				},
				'a.b': { f: arr },
				'a.b.c': num,
			})
		}
	})
	it('test update non-existing doc', async () => {
		// * admin doesn't throw when updating non existing doc
		const docRef = userRefCreator().doc('FirelordTest', 'updateEmptyData')
		deleteDoc(docRef)
		expect.assertions(1)
		try {
			await updateDocNoFlatten(docRef, {})
		} catch (e) {
			expect(true).toBe(true)
		}
	})
})
