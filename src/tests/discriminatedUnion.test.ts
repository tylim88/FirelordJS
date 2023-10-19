import { MetaTypeCreator, getFirelord, getFirestore, updateDoc } from '../index'

describe('test update discrimination unions', () => {
	type DU = MetaTypeCreator<
		| { a: { b: 1; c: 2 } | { b: 'a'; d: 'b' } }
		| { x: { y: 1; z: 2; u: 3 } | { y: 'a'; w: 'b'; v: 'c' } | false },
		'abc'
	>

	const du = getFirelord<DU>(getFirestore(), 'abc')

	const docRef = du.doc('123')

	updateDoc(docRef, { a: { b: 1 } })

	const v = false as boolean

	const x = v
		? {
				y: 1 as const,
		  }
		: {
				w: 'b' as const,
		  }

	// ok as expected
	updateDoc(docRef, {
		x,
	})

	// should be ok but error
	// this error is unrelated to const assertion because of const modifier on type parameters
	updateDoc(docRef, {
		x: v
			? {
					y: 1,
					z: 2,
			  }
			: {
					w: 'b',
					v: 'c',
			  },
	})

	const data = {
		x: v
			? {
					y: 1,
					z: 2,
					u: 3,
			  }
			: {
					y: 'a',
					w: 'b',
					v: 'c',
			  },
	}
	// should be error because no const assertion but ok
	// @ts-expect-error
	updateDoc(docRef, data)
})
