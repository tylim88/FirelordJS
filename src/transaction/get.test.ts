import { getCreator } from './get'
import { GetDoc, IsTrue, IsSame } from '../types'
import { userRefCreator } from '../utilForTests'
import { runTransaction } from '.'

// delete functionality test is tested in other integration test
describe('test get transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof getCreator>
		type B = GetDoc
		IsTrue<IsSame<A, B>>()
	})
	it('test return data type and functionality', () => {
		;() => {
			runTransaction(transaction => {
				return transaction
					.get(userRefCreator().doc('FirelordTest', '123'))
					.then(docSnap => {
						const data = docSnap.data()
						/*  eslint-disable unused-imports/no-unused-vars */
						if (data) {
							const {
								beenTo,
								name,
								role,
								age,
								a: {
									b: {
										c,
										f,
										// @ts-expect-error
										p,
									},
								},
								// @ts-expect-error
								unknown,
							} = data
							/*  eslint-enable unused-imports/no-unused-vars */
						}
					})
			})
		}
	})
})
