import { and, or } from 'firebase/firestore'
import { QueryCompositeFilter, MetaType } from '../types'
import { queryBuilder } from './utils'

export const queryCompositeFilterCreator =
	<T extends MetaType, Type extends 'or' | 'and'>(
		type: Type
	): QueryCompositeFilter<T, Type> =>
	// @ts-expect-error
	(...queryConstraints) => {
		if (type === 'and') {
			return and(...queryBuilder(queryConstraints))
		} else {
			return or(...queryBuilder(queryConstraints))
		}
	}
