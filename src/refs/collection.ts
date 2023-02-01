import { CollectionCreator } from '../types'
import { collection } from 'firebase/firestore'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const collectionCreator: CollectionCreator =
	(fStore, collectionIDs) =>
	// @ts-expect-error
	(...documentIDs) => {
		return collection(
			// @ts-expect-error
			fStore,
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				documentIDs,
			})
		)
	}
