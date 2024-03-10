import { OrderByDirection, QueryOrderByConstraint } from '../alias'
import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'
import { __name__ } from '../fieldPath'

export type OrderByConstraint<FieldPath extends string> = {
	type: 'orderBy'
	fieldPath: FieldPath
	ref: QueryOrderByConstraint
}

export type OrderBy = <
	T extends MetaType,
	FieldPath extends GetAllCompareKeys<T> | __name__,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<FieldPath>
