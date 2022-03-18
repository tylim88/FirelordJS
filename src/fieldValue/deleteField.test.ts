import { getFirelord } from '..'
import { setDoc, getDoc, updateDoc } from '../operations'
import { deleteField } from './deleteField'
import { initializeApp } from '../utilForTests'
import {
	DeleteAbleFieldValue,
	IsTrue,
	IsSame,
	ErrorFieldValueInArray,
	Creator,
} from '../types'

initializeApp()

type A = Creator<
	{
		a: string
		b: {
			c:
				| {
						d: boolean | DeleteAbleFieldValue // array should not be able to use field value
				  }[]
				| DeleteAbleFieldValue
			e: number | DeleteAbleFieldValue
		}
		f: boolean | DeleteAbleFieldValue
	},
	'A',
	string
>

describe('test deleteField', () => {
	const A = getFirelord()<A>('A')
	const docRef = A.doc('deleteFieldTest')

	it('test read type', () => {
		type Read = A['read']

		type ExpectedRead = {
			a: string
			b: {
				c:
					| {
							d: boolean | ErrorFieldValueInArray
					  }[]
					| undefined
				e: number | undefined
			}
			f: boolean | undefined
		}
		IsTrue<IsSame<ExpectedRead, Read>>()
	})
	it('test correct type', () => {
		;() => {
			setDoc(
				docRef,
				{
					a: 'abc',
					b: { c: [{ d: true }], e: 3 },
					f: deleteField(),
				},
				{ mergeFields: ['f', 'a'] }
			)
		}
		;() => {
			setDoc(
				docRef,
				{
					a: 'abc',
					b: { c: [{ d: true }] },
					f: deleteField(),
				},
				{ merge: true }
			)
		}
		;() => {
			updateDoc(docRef, {
				a: 'abc',
				f: deleteField(),
				'b.c': deleteField(),
			})
		}
	})
	it('test incorrect type and merge field false error, should error', () => {
		;() => {
			setDoc(docRef, {
				a: 'abc',
				b: { c: [{ d: true }], e: 3 },
				// @ts-expect-error
				f: deleteField(),
			})
		}
		;() => {
			setDoc(
				docRef,
				{
					a: 'abc',
					// @ts-expect-error
					b: { c: [{ d: true }] },
					// @ts-expect-error
					f: deleteField(),
				},
				{ merge: false }
			)
		}
		;() => {
			setDoc(
				docRef,
				{
					b: { c: [{ d: true }], e: 3 },
					// @ts-expect-error
					f: deleteField(),
				},
				{ merge: false }
			)
		}
		;() => {
			setDoc(
				docRef,
				{
					// @ts-expect-error
					a: deleteField(), // incorrect type
					b: {
						c: [
							{
								// @ts-expect-error
								d: deleteField(), // array reject all field value
							},
						],
						// @ts-expect-error
						e: deleteField(), // must be at top level
					},
				},
				{ merge: true }
			) // must have merge:true or merge field
			updateDoc(docRef, {
				// @ts-expect-error
				a: deleteField(), // incorrect type
				b: {
					c: [
						{
							// @ts-expect-error
							d: deleteField(), // array reject all field value
						},
					],
					e: deleteField(),
				},
			})
		}
	})
	it('test functionality with update', async () => {
		await setDoc(docRef, { a: 'a', b: { c: [{ d: true }], e: 3 }, f: false })
		await updateDoc(docRef, {
			a: 'b',
			b: { c: [{ d: true }] },
			'b.e': deleteField(),
			f: deleteField(),
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.data()).toEqual({
			a: 'b',
			b: { c: [{ d: true }] },
		})
	})
	it('test functionality with set', async () => {
		await setDoc(docRef, { a: 'a', b: { c: [{ d: true }], e: 3 }, f: true })
		await updateDoc(docRef, {
			a: 'b',
			b: { c: [{ d: false }] },
			'b.e': deleteField(),
			f: deleteField(),
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.data()).toEqual({ a: 'b', b: { c: [{ d: false }] } })
	})
})
