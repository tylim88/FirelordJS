import { OrderByConstraint } from './constraints'
import { OrderByDirection } from './alias'
import { MetaType } from './metaTypeCreator'
import { __name__ } from './fieldPath'

export type OrderBy = <
	T extends MetaType,
	FieldPath extends (keyof T['compare'] & string) | __name__,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<FieldPath, DirectionStr>
