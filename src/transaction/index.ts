import { setCreator } from './set'
import { updateCreator } from './update'
import { getCreator } from './get'
import { deleteCreator } from './delete'
import { FirelordFirestore, Transaction } from '../types'
import { runTransaction as runTransaction_ } from 'firebase/firestore'

/** 
Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within the transaction has changed, Cloud Firestore retries the updateFunction. If it fails to commit after 5 attempts, the transaction fails.

The maximum number of writes allowed in a single transaction is 500.

@param firestore
A reference to the Firestore database to run this transaction against.

@param updateFunction
The function to execute within the transaction context.

@returns
If the transaction completed successfully or was explicitly aborted (the updateFunction returned a failed promise), the promise returned by the updateFunction is returned here. Otherwise, if the transaction failed, a rejected promise with the corresponding failure error is returned.
*/
export const runTransaction = <T>( // what is this T for?
	firestore: FirelordFirestore.Firestore,
	updateFunction: (transaction: Transaction) => Promise<T>
) => {
	return runTransaction_(firestore, async transaction => {
		const set = setCreator(transaction)
		const update = updateCreator(transaction)
		const get = getCreator(transaction)
		const delete_ = deleteCreator(transaction)
		return updateFunction({ set, update, get, delete: delete_ })
	})
}
