import { example, db } from './init'
import {
	runTransaction,
	serverTimestamp,
	increment,
	arrayRemove,
} from 'firelordjs'

export const dummy = async () => {
	try {
		const result = await runTransaction(
			db, // db argument is optional, you can skip it
			async transaction => {
				await transaction.get(example.doc('lmn')).then(docSnapshot => {
					const data = docSnapshot.data()
				})

				transaction.set(example.doc('lmn'), {
					a: 88,
					b: { c: false, d: [{ e: 'opq' }] },
					f: { g: serverTimestamp(), h: 2929 },
				})

				transaction.update(example.doc('lmn'), {
					a: increment(1),
					b: { d: arrayRemove({ e: 'rst' }) }, // nested form
					'f.g': serverTimestamp(), // dot notation form
				})

				transaction.delete(example.doc('lmn'))

				return 123 // return this to result
			},
			{ maxAttempts: 10 } // max commit attempt, optional
		)
		console.log(result) // result is 123 because we return 123 in runTransaction callback
	} catch (e) {
		console.log('Transaction failed: ', e)
	}
}
