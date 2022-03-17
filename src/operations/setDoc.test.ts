import { setDoc } from './setDoc'

import {
	userRefCreator,
	initializeApp,
	writeThenReadTest,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { increment, arrayUnion, serverTimestamp } from '../fieldValue'
import { Set, IsTrue, IsSame } from '../types'

initializeApp()
const userRef = userRefCreator()
describe('test setDoc', () => {
	it('test whether the return type is correct', () => {
		type A = typeof setDoc
		type B = Set
		IsTrue<IsSame<A, B>>()
	})
	it('test wrong type', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					// @ts-expect-error
					beenTo: [{}],
					// @ts-expect-error
					name: true,
					// @ts-expect-error
					role: 'admi1n',
					// @ts-expect-error
					age: '3',
					// @ts-expect-error
					a: {},
				},
				undefined
			)
		;() =>
			setDoc(userRef.doc('123'), {
				beenTo: [],
				// @ts-expect-error
				name: true,
				// @ts-expect-error
				role: 'admi1n',
				// @ts-expect-error
				age: '3',
				a: {
					b: {
						// @ts-expect-error
						c: true,
						f: [
							{
								// @ts-expect-error
								g: undefined,
								// @ts-expect-error
								h: serverTimestamp(),
								// @ts-expect-error
								m: increment(1),
							},
						],
					}, // @ts-expect-error
					e: [true],
				},
			})
	})
	it('test missing member', () => {
		;() =>
			// @ts-expect-error
			setDoc(userRef.doc('123'), {
				beenTo: [{ China: ['Guangdong'] }],
				name: 'abc',
				role: 'visitor',
			})
	})
	it('test empty array', () => {
		;() =>
			setDoc(userRef.doc('123'), {
				beenTo: [],
				name: 'abc',
				role: 'admin',
				age: 30,
				a: {
					b: { c: 1, f: [] },
					e: [],
					i: { j: increment(1), l: new Date() },
					k: serverTimestamp(),
				},
			})
	})
	it('test filled array', () => {
		;() =>
			setDoc(userRef.doc('123'), {
				beenTo: [{ US: ['California', 'Hawaii'] }],
				name: 'abc',
				role: 'admin',
				age: 30,
				a: {
					b: { c: 1, f: [{ g: true, h: new Date(), m: 1 }] },
					e: arrayUnion(...['a']),
					i: { j: increment(1), l: new Date() },
					k: serverTimestamp(),
				},
			})
	})
	it('test full correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = { ...generateRandomData(), unknown: '123' }
		;() =>
			setDoc(
				userRef.doc('123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	it('test merge:false with missing type', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					name: 'abc',
					role: 'admin',
					age: 30,
					// @ts-expect-error
					a: {
						b: {
							c: 1,
							f: [{ g: false, h: new Date(), m: 1 }],
						},
						i: { j: increment(1), l: new Date() },
						k: serverTimestamp(),
					},
				},
				{ merge: false }
			)
	})
	it('test merge:false with correct type', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					name: 'abc',
					role: 'admin',
					age: 30,
					a: {
						b: { c: 1, f: [{ g: false, h: new Date(), m: 1 }] },
						e: ['1'],
						i: { j: increment(1), l: new Date() },
						k: serverTimestamp(),
					},
				},
				{ merge: false }
			)
	})
	it('test merge type with missing data type in non array, should pass', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					name: 'abc',
					age: 30,
					a: {
						b: { c: 1, f: [{ g: true, h: new Date(), m: 1 }] },
						i: { j: increment(1), l: new Date() },
						k: serverTimestamp(),
					},
				},
				{ merge: true }
			)
	})
	it('test merge type with missing data type in array, should failed', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					name: 'abc',
					age: 30,
					a: {
						b: {
							c: 1,
							// @ts-expect-error
							f: [{ g: true, h: new Date() }],
						},
						i: { j: increment(1), l: new Date() },
						k: serverTimestamp(),
					},
				},
				{ merge: true }
			)
	})
	it('test merge field type with empty path', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					age: 30,
					a: {
						b: { c: 1, f: [{ g: true, h: new Date(), m: 1 }] },
						k: serverTimestamp(),
					},
				},
				{ mergeFields: [] }
			)
	})
	it('test merge field type with correct path', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					age: 30,
					a: {
						b: { c: 1, f: [{ g: true, h: new Date(), m: 1 }] },
						k: serverTimestamp(),
					},
				},
				{
					mergeFields: ['a', 'a.k', 'a.b', 'a.b.c', 'a.b.f'],
				}
			)
	})
	it('test merge field type with incorrect path', () => {
		;() =>
			setDoc(
				userRef.doc('123'),
				{
					beenTo: [{ US: ['California', 'Hawaii'] }],
					name: 'abc',
					age: 30,
					a: {
						b: { c: 1, f: [{ g: true, h: new Date(), m: 1 }] },
						i: { j: increment(1), l: new Date() },
						k: serverTimestamp(),
					},
				},
				{
					mergeFields: [
						// @ts-expect-error
						'a.i.j.j',
						// @ts-expect-error
						'b',
						// @ts-expect-error
						'a.b.f.g',
					],
				}
			)
	})
	it('test functionality', async () => {
		await writeThenReadTest(async data => {
			const ref = userRef.doc('setDocTestCase')
			await setDoc(ref, data)

			return ref
		})
	})
	it('test merge false functionality', async () => {
		await writeThenReadTest(async data => {
			const ref = userRef.doc('setDocTestCaseMergeFalse')
			await setDoc(ref, data, { merge: false })

			return ref
		})
	})
	it('test merge true functionality', async () => {
		const ref = userRef.doc('setDocTestCaseMergeTrue')
		const data = generateRandomData()
		await setDoc(ref, data)
		await setDoc(ref, { a: { b: { f: [] } } }, { merge: true })
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field functionality', async () => {
		const ref = userRef.doc('setDocTestCaseMergeField')
		const data = generateRandomData()
		await setDoc(ref, data)
		await setDoc(ref, { a: { b: { f: [] } } }, { mergeFields: ['a.b.f'] })
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('test merge field empty functionality', async () => {
		const ref = userRef.doc('setDocTestCaseMergeFieldEmpty')
		const data = generateRandomData()
		await setDoc(ref, data)
		await setDoc(ref, { a: { b: { f: [] } } }, { mergeFields: [] })
		await readThenCompareWithWriteData(data, ref)
	})
})
