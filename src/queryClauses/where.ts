import { where as where_ } from 'firebase/firestore'
import {
	WhereConstraint,
	OriWhereFilterOp,
	DocumentId,
	__name__,
	MetaType,
	ErrorWhere__name__,
} from '../types'

/**
 * Creates a {@link QueryConstraint} that enforces that documents must contain the
 * specified field and that the value should satisfy the relation constraint
 * provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link Query}.
 */
export const where = <
	T extends MetaType,
	FieldPath extends (keyof T['writeFlatten'] & string) | DocumentId,
	OpStr extends OriWhereFilterOp,
	Value
>(
	fieldPath: FieldPath extends __name__ ? ErrorWhere__name__ : FieldPath,
	opStr: OpStr,
	value: Value
) => {
	let newValue = value
	if (
		Array.isArray(newValue) &&
		(opStr === 'in' || opStr === 'array-contains-any' || opStr === 'not-in') &&
		newValue.length === 0
	) {
		newValue = [
			'This is a very long string to prevent collision: %$GE&^G^*(N Y(&*T^VR&%R&^TN&*^RMN$BEDF^R%TFG%I%TFDH%(UI<)(UKJ^HGFEC#DR^T*&#$%(<RGFESAXSCVBGNHM(&%T^BTNRV%ITB^TJNTN^T^*T',
		] as typeof newValue
	}

	return {
		type: 'where',
		fieldPath: fieldPath as string,
		opStr,
		value,
		ref: where_(fieldPath as string, opStr, newValue),
	} as WhereConstraint<
		T,
		FieldPath extends DocumentId ? __name__ : FieldPath,
		OpStr,
		Value
	>
}
