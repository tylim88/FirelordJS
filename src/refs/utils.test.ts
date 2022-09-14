import { buildPathFromColIDsAndDocIDs } from './utils'

describe('test utils', () => {
	it('test buildPathFromColIDsAndDocIDs', () => {
		expect(
			buildPathFromColIDsAndDocIDs({
				collectionIDs: ['1', '2', '3'],
				documentIDs: ['a', 'b', 'c'],
			})
		).toBe('1/a/2/b/3/c/')

		expect(
			buildPathFromColIDsAndDocIDs({
				collectionIDs: ['1', '2', '3'],
				documentIDs: ['a', 'b'],
			})
		).toBe('1/a/2/b/3/')

		expect(
			buildPathFromColIDsAndDocIDs({
				collectionIDs: ['1', '2'],
				documentIDs: ['a', 'b', 'c'],
			})
		).toBe('1/a/2/b/')

		expect(
			buildPathFromColIDsAndDocIDs({
				collectionIDs: [],
				documentIDs: ['a', 'b', 'c'],
			})
		).toBe('')

		expect(
			buildPathFromColIDsAndDocIDs({
				collectionIDs: ['1', '2'],
				documentIDs: [],
			})
		).toBe('1/2/')
	})
})
