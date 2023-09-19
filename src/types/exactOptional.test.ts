import { ExactOptional } from './exactOptional'
import { IsTrue, IsSame } from './utils'

describe('test exact optional', () => {
	it('test union of primitive type with oject literal', () => {
		IsTrue<
			IsSame<
				ExactOptional<
					{ a: false | { b: 1; c: 2 } },
					{ a: false | { b: 1; c: 2 } },
					false,
					false,
					true
				>,
				{ a?: false | { b: 1; c: 2 } | { b?: 1; c?: 2 } }
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<
					{ a: false | { b: 1; c: 2 } },
					{ a: false | { b: 1 } },
					false,
					false,
					true
				>,
				{ a?: false | { b: 1; c: 2 } | { b?: 1 } }
			>
		>()
	})
})
