import { deleteDoc } from './deleteDoc'
import { DeleteDoc, IsTrue, IsSame } from '../types'

// delete functionality test is tested in other integration test
describe('test delete', () => {
	it('test whether the return type is correct', () => {
		type A = typeof deleteDoc
		type B = DeleteDoc
		IsTrue<IsSame<A, B>>()
	})
})
