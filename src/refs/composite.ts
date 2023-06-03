import { and, or } from 'firebase/firestore'
import { QueryCompositeFilter, MetaType } from '../types'
import { queryBuilder } from './utils'

export const queryCompositeFilterCreator =
	<T extends MetaType, Type extends 'or' | 'and'>(
		type: Type
	): QueryCompositeFilter<T, Type> =>
	(...queryConstraints) => {
		const constraints = queryBuilder(queryConstraints)
		return {
			type,
			constraints,
			ref: type === 'and' ? and(...constraints) : or(...constraints),
		}
	}
