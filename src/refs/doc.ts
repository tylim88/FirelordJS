import { DocCreator } from '../types'
import { doc as doc_ } from 'firebase/firestore'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const docCreator: DocCreator =
	(fStore, collectionIDs) =>
	// @ts-expect-error
	(...documentIDs) => {
		return doc_(
			// @ts-expect-error
			fStore,
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				documentIDs,
			})
		)
	}
