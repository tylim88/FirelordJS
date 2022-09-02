import { IsTrue } from './utils'
import { SnapshotOptions } from './alias'
import { NoneAndPrevious } from './unionReadTimestampWithNull'

describe('test unionReadTimestampWithNull', () => {
	it('test NoneAndPrevious', () => {
		// this is a controlled type that make sure 'none' | 'previous' is part of SnapshotOptions['serverTimestamps']
		// if firestore change the object literal type then we would know
		IsTrue<
			NoneAndPrevious extends SnapshotOptions['serverTimestamps'] ? true : false
		>()
	})
})
