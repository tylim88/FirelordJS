import { LimitConstraint } from './queryConstraints'
import { QueryConstraint } from './alias'
import { ErrorLimitInvalidNumber } from './error'
import { Narrow } from './utils'

export type LimitCreator = <Type extends 'limit' | 'limitToLast'>(
	type: Type,
	clause: (limit: number) => QueryConstraint
) => <Value extends number>(
	limit: Narrow<Value> extends 0
		? ErrorLimitInvalidNumber
		: number extends Value
		? Value
		: Value extends infer R
		? `${R & number}` extends `-${number}` | `${number}.${number}`
			? ErrorLimitInvalidNumber
			: Value
		: never // impossible route
) => LimitConstraint<Type, Value>
