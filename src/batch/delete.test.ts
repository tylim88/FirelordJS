import { writeBatch } from '.'
import { IsTrue, IsSame, WriteBatchDelete } from '../types'

// delete functionality test is tested in other integration test
describe('test delete batch', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof writeBatch>['delete']
		type B = WriteBatchDelete
		IsTrue<IsSame<A, B>>()
	})
})
