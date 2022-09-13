import { CollectionCreator } from '../types'
import { collection as collection_ } from 'firebase/firestore'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const collectionCreator: CollectionCreator =
	(fStore, collectionIDs) =>
	// @ts-expect-error
	(...documentIDs) => {
		return collection_(
			// @ts-expect-error
			fStore,
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				documentIDs,
			})
		)
	}
