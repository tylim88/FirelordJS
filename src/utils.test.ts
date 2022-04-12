import { flatten, isFirestore } from './utils'
import {
	increment,
	arrayRemove,
	arrayUnion,
	deleteField,
	serverTimestamp,
} from './fieldValue'

const basic = {
	a: 123,
	b: null,
	c: undefined,
	d: 'abc',
	f: false,
	g: true,
	i: [],
	j: increment(1),
	k: arrayRemove([]),
	l: arrayUnion([]),
	m: serverTimestamp(),
	n: deleteField(),
	o: new Number(),
	p: new Boolean(),
	q: () => {
		//
	},
	r: function () {
		//
	},
	s: new Date(),
}

const a = {
	...basic,
	t: [{ ...basic }],
}

const prependPropsName = (obj: Record<string, unknown>, name: string) => {
	const newObj = {} as Record<string, unknown>
	for (const prop in obj) {
		newObj[name + prop] = obj[prop]
	}
	return newObj
}

describe('test flatten', () => {
	it('test empty', () => {
		expect(flatten({})).toEqual({})
	})
	it('test isOption', () => {
		expect(isFirestore({})).toBe(false)
		expect(isFirestore({ type: 'firest1ore' })).toBe(false)
		expect(isFirestore({ type: 'firestore' })).toBe(true)
		expect(isFirestore({ type: 'firestore-lite' })).toBe(true)
		expect(isFirestore({ useEmulator: {} })).toBe(true)
		expect(isFirestore({ useEmulator: undefined })).toBe(false)
	})
	it('test basic', () => {
		expect(
			flatten({
				...a,
				aa: {
					...a,
					aa: {
						...a,
					},
				},
			})
		).toEqual({
			...a,
			...prependPropsName(a, 'aa.'),
			...prependPropsName(a, 'aa.aa.'),
		})
	})
	it('test hybrid', () => {
		expect(
			flatten({
				a: 123,
				b: null,
				c: undefined,
				d: 'abc',
				f: false,
				g: true,
				aa: {
					a: 123,
					b: null,
					c: undefined,
					d: 'abc',
					f: false,
					g: true,
				},
				'bb.a': 123,
				'bb.b': null,
				'bb.c': undefined,
				'bb.d': 'abc',
				'bb.f': false,
				'bb.g': true,
			})
		).toEqual({
			a: 123,
			b: null,
			c: undefined,
			d: 'abc',
			f: false,
			g: true,
			'aa.a': 123,
			'aa.b': null,
			'aa.c': undefined,
			'aa.d': 'abc',
			'aa.f': false,
			'aa.g': true,
			'bb.a': 123,
			'bb.b': null,
			'bb.c': undefined,
			'bb.d': 'abc',
			'bb.f': false,
			'bb.g': true,
		})
	})
	it('test hybrid with repeated name', () => {
		expect(
			flatten({
				a: 123,
				b: null,
				c: undefined,
				d: 'abc',
				f: false,
				g: true,
				aa: {
					a: 456,
					b: null,
					c: undefined,
					d: 'xyz',
					f: true,
					g: false,
				},
			})
		).toEqual({
			a: 123,
			b: null,
			c: undefined,
			d: 'abc',
			f: false,
			g: true,
			'aa.a': 456,
			'aa.b': null,
			'aa.c': undefined,
			'aa.d': 'xyz',
			'aa.f': true,
			'aa.g': false,
		})
	})
})
