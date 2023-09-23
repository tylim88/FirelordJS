import { ExactOptional } from './exactOptional'
import { IsTrue, IsSame } from './utils'
import { ErrorKeyNotExist } from './error'

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

	it('test nested key unknown member', () => {
		IsTrue<
			IsSame<
				ExactOptional<
					{ a: false | { b: 1; c: 2 } },
					{ a: false | { b: 1; d: 3 } },
					false,
					false,
					true
				>,
				{ a?: false | { b?: 1; d?: ErrorKeyNotExist<'d'> } | { b: 1; c: 2 } }
			>
		>()
	})

	it('test mapped type', () => {
		IsTrue<
			IsSame<
				ExactOptional<Record<string, number>, { a: 1 }, false, false, true>,
				{ a?: number }
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<Record<string, 1>, { a: 2 }, false, false, true>,
				{ a?: 1 }
			>
		>()
	})
})
