import { OrderByDirection, QueryOrderByConstraint } from '../alias'
import { MetaType } from '../metaTypeCreator'
import { __name__ } from '../fieldPath'

export type OrderByConstraint<FieldPath extends string> = {
	type: 'orderBy'
	fieldPath: FieldPath
	ref: QueryOrderByConstraint
}

export type OrderBy = <
	T extends MetaType,
	FieldPath extends (keyof T['compare'] & string) | __name__,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<FieldPath>
