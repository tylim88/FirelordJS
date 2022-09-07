import { getDoc } from './getDoc'
import { GetDoc, IsTrue, IsSame } from '../types'

// dont need to test get functionality because it is tested together with set and update
describe('test getDoc', () => {
	it('test whether the return type is correct', () => {
		type A = typeof getDoc
		type B = GetDoc
		IsTrue<IsSame<A, B>>()
	})
})
