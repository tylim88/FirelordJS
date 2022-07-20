import { removeFieldValueInhomogeneousProps } from './utils'
import { arrayRemove } from './arrayRemove'
import { flatten } from '../utils'

describe('test removeEmptyArrayFieldValue', () => {
	it('not removing anything test', () => {
		const result = flatten(
			removeFieldValueInhomogeneousProps({
				a: 1,
				b: {
					c: 2,
					d: arrayRemove(1),
				},
			})
		)
		expect(Object.keys(result)).toEqual(['a', 'b.c', 'b.d'])
	})
	it('remove something test', () => {
		const abc: string[] = []
		const result = flatten(
			removeFieldValueInhomogeneousProps({
				a: 1,
				b: {
					c: 2,
					d: arrayRemove(...abc),
				},
			})
		)
		expect(Object.keys(result)).toEqual(['a', 'b.c'])
	})
})
