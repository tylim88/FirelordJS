import { OrderByDirection } from '../alias'
import { MetaType } from '../metaTypeCreator'
import { __name__ } from '../fieldPath'

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends OrderByDirection | undefined = undefined
> = {
	type: 'orderBy'
	_field: FieldPath
	_direction: DirectionStr
}

export type OrderBy = <
	T extends MetaType,
	FieldPath extends (keyof T['compare'] & string) | __name__,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<FieldPath, DirectionStr>
