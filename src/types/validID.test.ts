import { MetaTypeCreator } from './metaTypeCreator'
import {
	ErrorInvalidDocumentOrCollectionID,
	ErrorInvalidDocumentOrCollectionIDStart,
} from './error'
import { PossiblyReadAsUndefined } from './fieldValue'
import { IsTrue } from './utils'

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
			'/' | 'A/' | '~!@#$%^&*()_+-=' | '.',
			'/' | '/A/' | 'A/A' | '.'
		>

		type CollectionIDTypeCheck<T extends string> = T[] extends (
			| '~!@#$%^&*()_+-='
			| ErrorInvalidDocumentOrCollectionIDStart<'Collection'>
			| ErrorInvalidDocumentOrCollectionID<'Collection'>
		)[]
			? (
					| '~!@#$%^&*()_+-='
					| ErrorInvalidDocumentOrCollectionIDStart<'Collection'>
					| ErrorInvalidDocumentOrCollectionID<'Collection'>
			  )[] extends T[]
				? true
				: false
			: false
		type DocumentIDTypeCheck<T extends string> = T[] extends (
			| ErrorInvalidDocumentOrCollectionIDStart<'Document'>
			| ErrorInvalidDocumentOrCollectionID<'Document'>
		)[]
			? (
					| ErrorInvalidDocumentOrCollectionIDStart<'Document'>
					| ErrorInvalidDocumentOrCollectionID<'Document'>
			  )[] extends T[]
				? true
				: false
			: false

		type collectionID = A['collectionID']
		type docID = A['docID']
		IsTrue<CollectionIDTypeCheck<collectionID>>()
		IsTrue<DocumentIDTypeCheck<docID>>()
	})
})
