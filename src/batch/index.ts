import { setCreator } from './set'
import { updateCreator } from './update'
import { updateNoFlattenCreator } from './updateNoFlatten'
import { deleteCreator } from './delete'
import { Firestore, WriteBatch } from '../types'
import { writeBatch as writeBatch_, getFirestore } from 'firebase/firestore'

/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single {@link WriteBatch}
 * is 500.
 *
 * Unlike transactions, write batches are persisted offline and therefore are
 * preferable when you don't need to condition your writes on read data.
 *
 * @param firestore Optional, a reference to the Firestore database.
 * If no value is provided, default Firestore instance is used.
 *
 * @returns A {@link WriteBatch} that can be used to atomically execute multiple
 * writes.
 */
export const writeBatch = (firestore?: Firestore): WriteBatch => {
	const batch = writeBatch_(firestore || getFirestore())
	return {
		commit: () => batch.commit(),
		set: setCreator(batch),
		update: updateCreator(batch),
		delete: deleteCreator(batch),
		updateNoFlatten: updateNoFlattenCreator(batch),
	}
}
