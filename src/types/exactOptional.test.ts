import {
	ExactOptional,
	HandleUnknownMember,
	RecursivelyReplaceDeleteFieldWithErrorMsg,
} from './exactOptional'
import { IsTrue, IsSame } from './utils'
import { ServerTimestamp } from './fieldValues'

describe('test exact optional', () => {
	it('test discriminated union', () => {
		IsTrue<
			IsSame<
				ExactOptional<
					{ b: 0; d: 1 } | { b: 1; c: 2 },
					{ b: 0; d: 1 },
					false,
					false,
					true
				>,
				| { b?: 0; d?: 1 }
				| HandleUnknownMember<
						// TODO remove this extra type
						{
							b: 1
							c: 2
						},
						{
							b: 0
							d: 1
						}
				  >
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<
					{ a: { b: 0; d: 1 } | { b: 1; c: 2 } },
					{ a: { b: 0; d: 1 } },
					false,
					false,
					true
				>,
				{
					a?:
						| { b?: 0; d?: 1 }
						| HandleUnknownMember<
								// TODO remove this extra type
								{
									b: 1
									c: 2
								},
								{
									b: 0
									d: 1
								}
						  >
				}
			>
		>()
	})

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
				{ a?: false | { b?: 1; c?: 2 } }
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
				{
					a?:
						| false
						| {
								b?: 1
								c?: 2
						  }
				}
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
				{
					a?:
						| false
						| HandleUnknownMember<
								{
									b: 1
									c: 2
								},
								{
									b: 1
									d: 3
								}
						  >
						| { b?: 1; c?: 2 }
				}
			>
		>()
	})

	it('test mapped type', () => {
		IsTrue<
			IsSame<
				ExactOptional<Record<string, number>, { a: 1 }, false, false, true>,
				{ [x: string]: number | undefined }
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<
					Record<string, number>,
					{ [x: string]: 1 },
					false,
					false,
					true
				>,
				{ [x: string]: number | undefined }
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<Record<string, 1>, { a: 2 }, false, false, true>,
				{ [x: string]: 1 | undefined }
			>
		>()
	})

	it('test nested mapped type', () => {
		IsTrue<
			IsSame<
				ExactOptional<
					{ a: Record<string, number> },
					{ a: { [x in string]: number } },
					false,
					false,
					true
				>,
				{ a?: { [x: string]: number | undefined } }
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<
					{ a: Record<string, ServerTimestamp> },
					{ a: { [x: string]: ServerTimestamp } },
					false,
					false,
					true
				>,
				{ a?: { [x: string]: ServerTimestamp | undefined } }
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<
					{
						a: Record<string, { a: ServerTimestamp; b: number }>
						b: ServerTimestamp
					},
					{ a: { [x: string]: { b: number } } },
					false,
					false,
					true
				>,
				{
					a?: { [x: string]: { a?: ServerTimestamp; b?: number } | undefined }
					b?: ServerTimestamp
				}
			>
		>()

		IsTrue<
			IsSame<
				ExactOptional<Record<string, 1>, { a: 2 }, false, false, true>,
				{ [x: string]: 1 | undefined }
			>
		>()
	})
})

describe('test RecursivelyReplaceDeleteFieldWithErrorMsg', () => {
	it('test discriminated union', () => {
		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ b: 0; d: 1 } | { b: 1; c: 2 },
					{ b: 0; d: 1 }
				>,
				| { b: 0; d: 1 }
				| HandleUnknownMember<
						{
							b: 1
							c: 2
						},
						{
							b: 0
							d: 1
						}
				  >
			>
		>()

		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ a: { b: 0; d: 1 } | { b: 1; c: 2 } },
					{ a: { b: 0; d: 1 } }
				>,
				{
					a:
						| { b: 0; d: 1 }
						| HandleUnknownMember<
								{
									b: 1
									c: 2
								},
								{
									b: 0
									d: 1
								}
						  >
				}
			>
		>()
	})
	it('test union of primitive type with oject literal', () => {
		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ a: false | { b: 1; c: 2 } },
					{ a: false | { b: 1; c: 2 } }
				>,
				{ a: false | { b: 1; c: 2 } }
			>
		>()

		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ a: false | { b: 1; c: 2 } },
					{ a: false | { b: 1 } }
				>,
				{
					a:
						| false
						| {
								b: 1
								c: 2
						  }
				}
			>
		>()
	})

	it('test nested key unknown member', () => {
		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ a: false | { b: 1; c: 2 } },
					{ a: false | { b: 1; d: 3 } }
				>,
				{
					a:
						| false
						| {
								b: 1
								c: 2
						  }
				}
			>
		>()
	})

	it('test mapped type', () => {
		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					Record<string, number>,
					{ a: 1 }
				>,
				{ [x: string]: number }
			>
		>()

		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					Record<string, number>,
					{ [x: string]: 1 }
				>,
				{ [x: string]: number }
			>
		>()

		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<Record<string, 1>, { a: 2 }>,
				{ [x: string]: 1 }
			>
		>()
	})

	it('test nested mapped type', () => {
		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ a: Record<string, number> },
					{ a: { [x in string]: number } }
				>,
				{ a: { [x: string]: number } }
			>
		>()

		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<
					{ a: Record<string, ServerTimestamp> },
					{ a: { [x: string]: ServerTimestamp } }
				>,
				{ a: { [x: string]: ServerTimestamp } }
			>
		>()

		IsTrue<
			IsSame<
				RecursivelyReplaceDeleteFieldWithErrorMsg<Record<string, 1>, { a: 2 }>,
				{ [x: string]: 1 }
			>
		>()
	})
})
