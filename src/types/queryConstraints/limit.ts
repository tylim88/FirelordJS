import { QueryConstraint } from '../alias'
import { ErrorLimitInvalidNumber } from '../error'

type LimitType = {
	limit: 'F'
	limitToLast: 'L'
}

export type LimitConstraint<
	Type extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Type
	_limit: Value
	_limitType: LimitType[Type]
}

export type LimitCreator = <Type extends 'limit' | 'limitToLast'>(
	type: Type,
	clause: (limit: number) => QueryConstraint
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
) => LimitConstraint<Type, Value>
