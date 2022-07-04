import { getFirelord } from '..'
import { setDoc, getDoc, updateDoc } from '../operations'
import { deleteField } from './deleteField'
import { initializeApp } from '../utilForTests'
import {
	DeleteField,
	IsTrue,
	IsSame,
	ErrorFieldValueInArray,
	MetaTypeCreator,
} from '../types'

initializeApp()

type A = MetaTypeCreator<
	{
		a: string
		b: {
			c:
				| {
						d: boolean | DeleteField // array should not be able to use field value
				  }[]
				| DeleteField
			e: number | DeleteField
		}
		f: boolean | DeleteField
		g: { h: string | DeleteField }
		j: { k: string }
	},
	'A',
	string
>

describe('test deleteField', () => {
	const A = getFirelord<A>()('A')
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
			g: { h: string | undefined }
			j: { k: string }
		}
		IsTrue<IsSame<ExpectedRead, Read>>()
	})
	it('test correct type', () => {
		;() => {
			setDoc(
				docRef,
				{
					a: 'abc',
					b: {
						c: [{ d: true }],
						e: deleteField(), // low level is ok in merge
					},
					f: deleteField(),
					g: {
						h: deleteField(), // low level is ok in merge
					},
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
				b: { c: deleteField() }, // low level is ok for update because update flat everything internally
			})
		}
	})
	it('test incorrect type and merge field false error, should error', () => {
		;() => {
			setDoc(docRef, {
				a: 'abc',
				b: {
					c: [{ d: true }],
					e: 3,
				},
				// @ts-expect-error
				f: deleteField(),
				g: {
					// @ts-expect-error
					h: deleteField(),
				},
			})
		}
		;() => {
			setDoc(
				docRef,
				{
					// @ts-expect-error
					a: deleteField(),
					// @ts-expect-error
					b: { c: [{ d: true }] }, // error because incomplete member
					// @ts-expect-error
					f: deleteField(),
					g: {
						// @ts-expect-error
						h: deleteField(),
					},
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
						e: deleteField(), // low level is ok in merge
					},
					g: {
						h: deleteField(), // low level is ok in merge
					},
				},
				{ merge: true }
			) // must have merge:true or merge field

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
						e: deleteField(), // low level is ok in merge
					},
					g: {
						h: deleteField(), // low level is ok in merge
					},
					j: {
						// @ts-expect-error
						k: deleteField(),
					},
				},
				{ mergeFields: [] }
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
		await setDoc(docRef, {
			a: 'a',
			b: { c: [{ d: true }], e: 3 },
			f: false,
			g: {
				h: 'jk',
			},
			j: { k: 'l' },
		})
		await updateDoc(docRef, {
			a: 'b',
			b: { c: [{ d: true }] },
			'b.e': deleteField(),
			f: deleteField(),
			g: {
				h: deleteField(),
			},
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.data()).toEqual({
			a: 'b',
			b: { c: [{ d: true }] },
			g: {},
			j: { k: 'l' },
		})
	})
	it('test functionality with set', async () => {
		await setDoc(docRef, {
			a: 'a',
			b: { c: [{ d: true }], e: 3 },
			f: true,
			g: {
				h: 'jk',
			},
			j: { k: 'l' },
		})
		await updateDoc(docRef, {
			a: 'b',
			b: { c: [{ d: false }] },
			'b.e': deleteField(),
			f: deleteField(),
			g: {
				h: deleteField(),
			},
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.data()).toEqual({
			a: 'b',
			b: { c: [{ d: false }] },
			g: {},
			j: { k: 'l' },
		})
	})
})
