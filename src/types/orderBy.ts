import { OrderByConstraint } from './constraints'
import { OrderByDirection } from './alias'
import { MetaType } from './metaTypeCreator'
import { DocumentId, __name__ } from './fieldPath'

export type OrderBy = <
	T extends MetaType,
	FieldPath extends (keyof T['compare'] & string) | DocumentId,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<
	FieldPath extends DocumentId ? __name__ : FieldPath,
	DirectionStr
>
