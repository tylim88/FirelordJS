import { setCreator } from './set'
import { updateCreator } from './update'
import { updateNoFlattenCreator } from './updateNoFlatten'
import { getCreator } from './get'
import { deleteCreator } from './delete'
import { RunTransaction } from '../types'
import {
	runTransaction as runTransaction_,
	getFirestore,
} from 'firebase/firestore'
import { isFirestore } from '../utils'
import { isTransactionOptions } from './utils'

/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - optional and skippable(function overload), a reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - optional, an options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */
// @ts-expect-error
export const runTransaction: RunTransaction = (
	firestore,
	updateFunction,
	options
) => {
	const fStore = isFirestore(firestore) ? firestore : getFirestore()
	const callback = isFirestore(firestore) ? updateFunction : firestore
	const transactionOptions = isTransactionOptions(updateFunction)
		? updateFunction
		: options
	return runTransaction_(
		// @ts-expect-error
		fStore, // ! testing messed up the type, weird
		async transaction => {
			const set = setCreator(transaction)
			const update = updateCreator(transaction)
			const get = getCreator(transaction)
			const delete_ = deleteCreator(transaction)
			const updateNoFlatten = updateNoFlattenCreator(transaction)
			return callback({
				set,
				update,
				get,
				delete: delete_,
				updateNoFlatten,
			})
		},
		transactionOptions
	)
}
