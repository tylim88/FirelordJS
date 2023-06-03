import { QueryLimitConstraint } from '../alias'
import { ErrorLimitInvalidNumber } from '../error'

export type LimitConstraint<Type extends 'limit' | 'limitToLast'> = {
	type: Type
	ref: QueryLimitConstraint
}

export type LimitCreator = <Type extends 'limit' | 'limitToLast'>(
	type: Type,
	clause: (limit: number) => QueryLimitConstraint
) => <const Value extends number>(
	limit: Value extends 0
		? ErrorLimitInvalidNumber
		: number extends Value
		? Value
		: Value extends infer R
		? `${R & number}` extends `-${number}` | `${number}.${number}`
			? ErrorLimitInvalidNumber
			: Value
		: never // impossible route
) => LimitConstraint<Type>
