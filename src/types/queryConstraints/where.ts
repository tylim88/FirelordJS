import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'
import { WhereFilterOp, QueryFieldFilterConstraint } from '../alias'
import { __name__ } from '../fieldPath'

export type WhereConstraint<
	T extends MetaType,
	FieldPath extends GetAllCompareKeys<T> | __name__,
	OpStr extends WhereFilterOp,
	Value
> = {
	type: 'where'
	fieldPath: FieldPath
	opStr: OpStr
	value: Value
	ref: QueryFieldFilterConstraint
}

export type Where = <
	T extends MetaType,
	FieldPath extends GetAllCompareKeys<T> | __name__,
	OpStr extends WhereFilterOp,
	const Value
>(
	fieldPath: FieldPath,
	opStr: OpStr,
	value: Value
) => WhereConstraint<T, FieldPath, OpStr, Value>
