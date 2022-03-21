import { where as where_ } from 'firebase/firestore'
import {
	WhereConstraint,
	FirelordFirestore,
	DocumentId,
	IsValidID,
	ErrorWhereDocumentFieldPath,
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
	FieldPath extends string | DocumentId,
	OpStr extends FirelordFirestore.WhereFilterOp,
	Value
>(
	fieldPath: FieldPath,
	opStr: OpStr,
	value: FieldPath extends DocumentId
		? Value extends string
			? IsValidID<Value, 'Document'>
			: ErrorWhereDocumentFieldPath
		: Value
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
	return where_(
		// @ts-expect-error
		fieldPath,
		opStr,
		newValue
	) as WhereConstraint<FieldPath, OpStr, Value>
}
