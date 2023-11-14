import { NoUndefinedAndBannedTypes, ErrorCollectionIDString } from '../error'
import { IsValidID } from '../validID'
import { ObjectFlatten } from '../objectFlatten'
import { __name__Record } from '../fieldPath'
import { MetaType } from './metaType'
import { ReadConverter, ReadJSONConverter } from './read'
import { WriteConverter, WriteUpdateConverter } from './write'
import { CompareConverter } from './compare'

export type MetaTypeCreator<
	Base extends Record<string, unknown>,
	CollectionID extends string,
	DocID extends string = string,
	Parent extends MetaType | null = null,
	Settings extends {
		allFieldsPossiblyReadAsUndefined?: boolean
		banNull?: boolean
	} = { allFieldsPossiblyReadAsUndefined: false; banNull: false }
> = (Settings['banNull'] extends true ? null : never) extends infer S
	? {
			base: Base
			read: Exclude<
				ReadConverter<
					Base,
					Settings['allFieldsPossiblyReadAsUndefined'] extends true
						? undefined
						: never,
					S
				>,
				undefined
			>
			readJSON: Exclude<
				ReadJSONConverter<
					Base,
					Settings['allFieldsPossiblyReadAsUndefined'] extends true
						? undefined
						: never,
					S
				>,
				undefined
			>
			write: WriteConverter<Base, S>
			writeMerge: WriteUpdateConverter<Base, S>
			writeFlatten: WriteUpdateConverter<ObjectFlatten<Base, string>, S>
			compare: CompareConverter<ObjectFlatten<Base, never>, S> & __name__Record
			collectionID: NoUndefinedAndBannedTypes<
				string extends CollectionID
					? ErrorCollectionIDString
					: IsValidID<CollectionID, 'Collection', 'ID'>,
				never
			>
			collectionPath: Parent extends MetaType
				? `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}`
				: CollectionID
			docID: IsValidID<DocID, 'Document', 'ID'>
			docPath: Parent extends MetaType
				? `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}/${DocID}`
				: `${CollectionID}/${DocID}`
			parent: Parent
			ancestors: Parent extends MetaType
				? [
						...Parent['ancestors'],
						MetaTypeCreator<Base, CollectionID, DocID, Parent, Settings>
				  ]
				: [MetaTypeCreator<Base, CollectionID, DocID, Parent, Settings>]
	  }
	: never
