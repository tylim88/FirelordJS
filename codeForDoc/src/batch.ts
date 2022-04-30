import { example, db } from './init'
import { writeBatch, serverTimestamp } from 'firelordjs'

const batch = writeBatch(db)
// OR
const batch_Alt = writeBatch()

export const dummy = async () => {
	batch.set(example.doc('hij'), {
		a: 6,
		b: { c: false, d: [{ e: 'xyz' }] },
		f: { g: serverTimestamp(), h: 1010 },
	})

	batch.update(example.doc('hij'), {
		a: 6,
		b: { c: false }, // nested form
		'f.g': serverTimestamp(), // dot notation form
	})

	batch.delete(example.doc('hij'))

	await batch.commit()
}
