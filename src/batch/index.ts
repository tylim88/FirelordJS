import { setCreator } from './set'
import { updateCreator } from './update'
import { deleteCreator } from './delete'
import { FirelordFirestore, WriteBatch } from '../types'
import { writeBatch as writeBatch_, getFirestore } from 'firebase/firestore'

/**
Creates a write batch, used for performing multiple writes as a single atomic operation. The maximum number of writes allowed in a single WriteBatch is 500.

Unlike transactions, write batches are persisted offline and therefore are preferable when you don't need to condition your writes on read data.

@returns
A WriteBatch that can be used to atomically execute multiple writes.
 */
export const writeBatch = (
	firestore?: FirelordFirestore.Firestore
): WriteBatch => {
	const batch = writeBatch_(firestore || getFirestore())
	return Object.freeze({
		commit: () => batch.commit(),
		set: setCreator(batch),
		update: updateCreator(batch),
		delete: deleteCreator(batch),
	})
}
