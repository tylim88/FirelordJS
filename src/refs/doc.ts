import { DocCreator } from '../types'
import { doc } from 'firebase/firestore'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const docCreator: DocCreator =
	(fStore, collectionIDs) =>
	// @ts-expect-error
	(collectionReferenceOrDocumentId, ...documentIDs) => {
		if (typeof collectionReferenceOrDocumentId !== 'string') {
			return doc(collectionReferenceOrDocumentId)
		} else {
			return doc(
				// @ts-expect-error
				fStore,
				buildPathFromColIDsAndDocIDs({
					collectionIDs,
					documentIDs: [collectionReferenceOrDocumentId].concat(documentIDs),
				})
			)
		}
	}
