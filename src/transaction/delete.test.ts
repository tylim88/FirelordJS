import { deleteCreator } from './delete'
import { IsTrue, IsSame, TransactionDelete } from '../types'

// delete functionality test is tested in other integration test
describe('test delete transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof deleteCreator>
		type B = TransactionDelete
		IsTrue<IsSame<A, B>>()
	})
})
