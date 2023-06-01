import { MetaTypeCreator } from './metaTypeCreator'
import {
	ErrorInvalidDocumentOrCollectionID,
	ErrorInvalidDocumentOrCollectionIDStart,
	ErrorEndOfID,
} from './error'
import { PossiblyReadAsUndefined } from './fieldValues'
import { IsTrue, IsSame } from './utils'

describe('test Firelord type', () => {
	it('test ID name', () => {
		type A = MetaTypeCreator<
			{
				a: 1 | PossiblyReadAsUndefined
				b:
					| {
							c: 'a' | PossiblyReadAsUndefined
							d: { e: false } | PossiblyReadAsUndefined
							f:
								| {
										g: Date | null | PossiblyReadAsUndefined
										h: 2 | PossiblyReadAsUndefined
								  }[]
								| PossiblyReadAsUndefined
					  }
					| PossiblyReadAsUndefined
			},
			'/' | 'A/' | '~!@#$%^&*()_+-=' | '.' | 'A//A',
			'/' | '/A/' | 'A/A' | 'A//A' | '.' | 'BB'
		>

		type collectionID = A['collectionID']
		type docID = A['docID']
		type C =
			| '~!@#$%^&*()_+-='
			| ErrorEndOfID
			| ErrorInvalidDocumentOrCollectionIDStart<'Collection'>
			| ErrorInvalidDocumentOrCollectionID<'Collection', 'ID'>

		type D =
			| 'BB'
			| ErrorEndOfID
			| ErrorInvalidDocumentOrCollectionIDStart<'Document'>
			| ErrorInvalidDocumentOrCollectionID<'Document', 'ID'>

		IsTrue<IsSame<collectionID, C>>()
		IsTrue<IsSame<docID, D>>()
	})
})
