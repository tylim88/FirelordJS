import { MetaTypeCreator, MetaType } from './metaTypeCreator'
import { Timestamp, Bytes, GeoPoint } from './alias'
import {
	ErrorNullBanned,
	ErrorUnionInvolveObjectType,
	ErrorDirectNested,
} from './error'
import {
	ArrayUnionOrRemove,
	Increment,
	ServerTimestamp,
	PossiblyReadAsUndefined,
	DeleteField,
} from './fieldValue'
import { DocumentReference } from './refs'
import { IsTrue, IsSame, IsEqual } from './utils'
import { Parent, User } from '../utilForTests'

describe('test Firelord type', () => {
	it('test parents equal', () => {
		IsTrue<IsSame<Parent, User['parent']>>()
	})
	it('test read all as undefined', () => {
		type A = MetaTypeCreator<
			{
				a: 1 | null
				b: {
					c: 'a'
					d: { e: false }
					f: { g: Date | null; h: 2 }[]
					j: ServerTimestamp | null | Date
					k: DocumentReference<MetaType> | null
				}
				h: string
				i: number | null
				l: { a: 1 } | { b: 2 }
			},
			'A',
			string,
			never,
			{ allFieldsPossiblyReadAsUndefined: true }
		>
		type ExpectedRead = {
			a: 1 | null | undefined
			b:
				| {
						c: 'a' | undefined
						d: { e: false | undefined } | undefined
						f:
							| {
									g: Timestamp | null | undefined
									h: 2 | undefined
							  }[]
							| undefined
						j: Timestamp | null | undefined
						k: DocumentReference<MetaType> | null | undefined
				  }
				| undefined
			h: string | undefined
			i: number | null | undefined
			l: ErrorUnionInvolveObjectType | undefined
		}

		type ExpectedWrite = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				f:
					| readonly {
							g: Date | Timestamp | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Date | Timestamp | null
							h: 2
					  }>
				j: ServerTimestamp | null | Date | Timestamp
				k: DocumentReference<MetaType> | null
			}
			h: string
			i: number | null | Increment
			l: ErrorUnionInvolveObjectType
		}

		type ExpectedWriteFlatten = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				f:
					| readonly {
							g: Timestamp | Date | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Timestamp | Date | null
							h: 2
					  }>
				j: ServerTimestamp | null | Date | Timestamp
				k: DocumentReference<MetaType> | null
				'd.e': false
			}
			h: string
			i: number | null | Increment
			l: ErrorUnionInvolveObjectType
			'b.c': 'a'
			'b.d': {
				e: false
			}
			'b.f':
				| readonly {
						g: Timestamp | Date | null
						h: 2
				  }[]
				| ArrayUnionOrRemove<{
						g: Timestamp | Date | null
						h: 2
				  }>
			'b.j': ServerTimestamp | null | Date | Timestamp
			'b.k': DocumentReference<MetaType> | null
			'b.d.e': false
		}

		type ExpectedCompare = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				'd.e': false
				f:
					| readonly {
							g: Timestamp | Date | null
							h: 2
					  }[]
				j: Timestamp | Date | null
				k: DocumentReference<MetaType> | null
			}
			h: string
			i: number | null
			l: ErrorUnionInvolveObjectType
			'b.c': 'a'
			'b.d': {
				e: false
			}
			'b.f':
				| readonly {
						g: Timestamp | Date | null
						h: 2
				  }[]
			'b.j': Timestamp | Date | null
			'b.k': DocumentReference<MetaType> | null
			'b.d.e': false
		}

		type Read = A['read']
		type Write = A['write']
		type WriteFlatten = A['writeFlatten']
		type Compare = A['compare']

		IsTrue<IsSame<ExpectedRead, Read>>()
		IsTrue<IsSame<ExpectedWrite, Write>>()
		IsTrue<IsEqual<ExpectedWriteFlatten, WriteFlatten>>()
		IsTrue<IsEqual<ExpectedCompare, Compare>>()
	})

	it('test possibly read undefined', () => {
		type A = MetaTypeCreator<
			{
				a: 1 | PossiblyReadAsUndefined | null
				b: {
					c: 'a' | PossiblyReadAsUndefined
					d: { e: false } | PossiblyReadAsUndefined
					f:
						| {
								g: Date | null | PossiblyReadAsUndefined
								h: 2 | PossiblyReadAsUndefined
						  }[]
						| PossiblyReadAsUndefined
					j: ServerTimestamp | null | PossiblyReadAsUndefined
					k: DocumentReference<MetaType> | null | PossiblyReadAsUndefined
				}
				h: string | PossiblyReadAsUndefined | null
				i: number | PossiblyReadAsUndefined
			},
			'A',
			string
		>
		type ExpectedRead = {
			a: 1 | undefined | null
			b: {
				c: 'a' | undefined
				d: { e: false } | undefined

				f:
					| {
							g: Timestamp | null | undefined
							h: 2 | undefined
					  }[]
					| undefined
				j: Timestamp | null | undefined
				k: DocumentReference<MetaType> | null | undefined
			}
			h: string | undefined | null
			i: number | undefined
		}

		type ExpectedWrite = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				f:
					| readonly {
							g: Date | Timestamp | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Date | Timestamp | null
							h: 2
					  }>
				j: ServerTimestamp | null
				k: DocumentReference<MetaType> | null
			}
			h: string | null
			i: number | Increment
		}

		type ExpectedWriteFlatten = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				'd.e': false
				f:
					| readonly {
							g: Timestamp | Date | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Timestamp | Date | null
							h: 2
					  }>
				j: ServerTimestamp | null
				k: DocumentReference<MetaType> | null
			}
			h: string | null
			i: number | Increment
			'b.f':
				| readonly {
						g: Timestamp | Date | null
						h: 2
				  }[]
				| ArrayUnionOrRemove<{
						g: Timestamp | Date | null
						h: 2
				  }>
			'b.c': 'a'
			'b.d': {
				e: false
			}
			'b.j': ServerTimestamp | null
			'b.d.e': false
			'b.k': DocumentReference<MetaType> | null
		}

		type ExpectedCompare = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				'd.e': false
				f:
					| readonly {
							g: Timestamp | Date | null
							h: 2
					  }[]
				j: Timestamp | Date | null
				k: DocumentReference<MetaType> | null
			}
			h: string | null
			i: number
			'b.c': 'a'
			'b.d': {
				e: false
			}
			'b.d.e': false
			'b.f':
				| readonly {
						g: Timestamp | Date | null
						h: 2
				  }[]
			'b.j': Timestamp | Date | null
			'b.k': DocumentReference<MetaType> | null
		}

		type Read = A['read']
		type Write = A['write']
		type WriteFlatten = A['writeFlatten']
		type Compare = A['compare']

		IsTrue<IsSame<ExpectedRead, Read>>()
		IsTrue<IsSame<ExpectedWrite, Write>>()
		IsTrue<IsEqual<ExpectedWriteFlatten, WriteFlatten>>()
		IsTrue<IsEqual<ExpectedCompare, Compare>>()
	})

	it('test ban null', () => {
		type A = MetaTypeCreator<
			{
				a: 1 | null
				b: {
					c: 'a' | null
					d: { e: false | null }
					f:
						| {
								g: Date | null
								h: 2 | null
						  }[]
						| null
					j: ServerTimestamp | null
					k: DocumentReference<MetaType> | null
				}
				h: string | null
				i: number | null
			},
			'A',
			string,
			never,
			{ banNull: true }
		>

		type ExpectedRead = {
			a: 1 | ErrorNullBanned
			b: {
				c: 'a' | ErrorNullBanned
				d: { e: false | ErrorNullBanned }
				f:
					| {
							g: Timestamp | ErrorNullBanned
							h: 2 | ErrorNullBanned
					  }[]
					| ErrorNullBanned
				j: Timestamp | ErrorNullBanned
				k: DocumentReference<MetaType> | ErrorNullBanned
			}
			h: string | ErrorNullBanned
			i: number | ErrorNullBanned
		}
		type ExpectedWrite = {
			a: 1 | ErrorNullBanned
			b: {
				c: 'a' | ErrorNullBanned
				d: { e: false | ErrorNullBanned }
				f:
					| readonly {
							g: Date | Timestamp | ErrorNullBanned
							h: 2 | ErrorNullBanned
					  }[]
					| ErrorNullBanned
					| ArrayUnionOrRemove<{
							g: Timestamp | Date | ErrorNullBanned
							h: ErrorNullBanned | 2
					  }>
				j: ServerTimestamp | ErrorNullBanned
				k: DocumentReference<MetaType> | ErrorNullBanned
			}
			h: string | ErrorNullBanned
			i: number | ErrorNullBanned | Increment
		}
		type ExpectedWriteFlatten = {
			a: 1 | ErrorNullBanned
			b: {
				c: 'a' | ErrorNullBanned
				d: {
					e: false | ErrorNullBanned
				}
				'd.e': false | ErrorNullBanned
				f:
					| ErrorNullBanned
					| readonly {
							g: Timestamp | Date | ErrorNullBanned
							h: 2 | ErrorNullBanned
					  }[]
					| ArrayUnionOrRemove<{
							g: Timestamp | Date | ErrorNullBanned
							h: 2 | ErrorNullBanned
					  }>
				j: ServerTimestamp | ErrorNullBanned
				k: DocumentReference<MetaType> | ErrorNullBanned
			}
			'b.j': ServerTimestamp | ErrorNullBanned
			'b.c': 'a' | ErrorNullBanned
			'b.d': {
				e: false | ErrorNullBanned
			}
			'b.d.e': false | ErrorNullBanned
			'b.f':
				| ErrorNullBanned
				| readonly {
						g: Timestamp | Date | ErrorNullBanned
						h: 2 | ErrorNullBanned
				  }[]
				| ArrayUnionOrRemove<{
						g: Timestamp | Date | ErrorNullBanned
						h: 2 | ErrorNullBanned
				  }>
			h: string | ErrorNullBanned
			i: number | ErrorNullBanned | Increment
			'b.k': DocumentReference<MetaType> | ErrorNullBanned
		}

		type ExpectedCompare = {
			a: 1 | ErrorNullBanned
			b: {
				c: 'a' | ErrorNullBanned
				d: {
					e: false | ErrorNullBanned
				}
				'd.e': false | ErrorNullBanned
				f:
					| ErrorNullBanned
					| readonly {
							g: Date | Timestamp | ErrorNullBanned
							h: ErrorNullBanned | 2
					  }[]
				j: Date | Timestamp | ErrorNullBanned
				k: DocumentReference<MetaType> | ErrorNullBanned
			}
			'b.j': Date | Timestamp | ErrorNullBanned
			'b.c': 'a' | ErrorNullBanned
			'b.d': {
				e: false | ErrorNullBanned
			}
			'b.d.e': false | ErrorNullBanned
			'b.f':
				| ErrorNullBanned
				| readonly {
						g: Date | Timestamp | ErrorNullBanned
						h: ErrorNullBanned | 2
				  }[]
			h: string | ErrorNullBanned
			i: number | ErrorNullBanned
			'b.k': DocumentReference<MetaType> | ErrorNullBanned
		}

		type Read = A['read']
		type Write = A['write']
		type WriteFlatten = A['writeFlatten']
		type Compare = A['compare']

		IsTrue<IsSame<ExpectedRead, Read>>()
		IsTrue<IsSame<ExpectedWrite, Write>>()
		IsTrue<IsEqual<ExpectedWriteFlatten, WriteFlatten>>()
		IsTrue<IsEqual<ExpectedCompare, Compare>>()
	})

	it('test union involve object type & DeleteAbleFieldValue', () => {
		type A = MetaTypeCreator<
			{
				a: 1 | null | DeleteField
				b: {
					c: 'a' | DeleteField
					d: { e: false } | DeleteField
					f: { g: Date | null; h: 2 }[] | DeleteField
					j: ServerTimestamp | null | Date | DeleteField
					k: DocumentReference<MetaType> | null | DeleteField
				}
				h: string | DeleteField
				i: number | null | DeleteField
			},
			'A',
			string,
			never
		>
		type ExpectedRead = {
			a: 1 | null | undefined
			b: {
				c: 'a' | undefined
				d: { e: false } | undefined
				f:
					| {
							g: Timestamp | null
							h: 2
					  }[]
					| undefined
				j: Timestamp | null | undefined
				k: DocumentReference<MetaType> | null | undefined
			}

			h: string | undefined
			i: number | null | undefined
		}

		type ExpectedWrite = {
			a: 1 | null
			b: {
				c: 'a'
				d: { e: false }
				f:
					| readonly {
							g: Date | Timestamp | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Date | Timestamp | null
							h: 2
					  }>

				j: ServerTimestamp | null | Date | Timestamp
				k: DocumentReference<MetaType> | null
			}
			h: string
			i: number | null | Increment
		}

		type ExpectedWriteMerge = {
			a: 1 | null | DeleteField
			b: {
				c: 'a' | DeleteField
				d: { e: false } | DeleteField
				f:
					| readonly {
							g: Date | Timestamp | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Date | Timestamp | null
							h: 2
					  }>
					| DeleteField
				j: ServerTimestamp | null | Date | Timestamp | DeleteField
				k: DocumentReference<MetaType> | null | DeleteField
			}
			h: string | DeleteField
			i: number | null | Increment | DeleteField
		}

		type ExpectedWriteFlatten = {
			a: 1 | null | DeleteField
			b: {
				c: 'a' | DeleteField
				d: { e: false } | DeleteField
				f:
					| readonly {
							g: Timestamp | Date | null
							h: 2
					  }[]
					| ArrayUnionOrRemove<{
							g: Timestamp | Date | null
							h: 2
					  }>
					| DeleteField
				j: ServerTimestamp | null | Date | Timestamp | DeleteField
				k: DocumentReference<MetaType> | null | DeleteField
				'd.e': false
			}
			h: string | DeleteField
			i: number | null | Increment | DeleteField
			'b.f':
				| readonly {
						g: Timestamp | Date | null
						h: 2
				  }[]
				| ArrayUnionOrRemove<{
						g: Timestamp | Date | null
						h: 2
				  }>
				| DeleteField
			'b.c': 'a' | DeleteField
			'b.d': { e: false } | DeleteField
			'b.j': ServerTimestamp | null | Date | Timestamp | DeleteField
			'b.k': DocumentReference<MetaType> | null | DeleteField
			'b.d.e': false
		}

		type ExpectedCompare = {
			a: 1 | null
			b: {
				c: 'a'
				d: {
					e: false
				}
				f:
					| readonly {
							g: Timestamp | Date | null
							h: 2
					  }[]
				j: Timestamp | Date | null
				k: DocumentReference<MetaType> | null
				'd.e': false
			}
			h: string
			i: number | null
			'b.c': 'a'
			'b.d': {
				e: false
			}
			'b.f':
				| readonly {
						g: Timestamp | Date | null
						h: 2
				  }[]

			'b.j': Timestamp | Date | null
			'b.k': DocumentReference<MetaType> | null
			'b.d.e': false
		}

		type Read = A['read']
		type Write = A['write']
		type WriteMerge = A['writeMerge']
		type WriteFlatten = A['writeFlatten']
		type Compare = A['compare']

		IsTrue<IsSame<ExpectedRead, Read>>()
		IsTrue<IsSame<ExpectedWrite, Write>>()
		IsTrue<IsSame<ExpectedWriteMerge, WriteMerge>>()
		IsTrue<IsEqual<ExpectedWriteFlatten, WriteFlatten>>()
		IsTrue<IsEqual<ExpectedCompare, Compare>>()
	})
	it('no direct array test', () => {
		type A = MetaTypeCreator<
			{
				a: [][]
				b: string[][]
				c: never[][]
				d: [[]]
			},
			'a',
			string
		>

		type Read = A['read']
		type Write = A['write']
		type WriteFlatten = A['writeFlatten']
		type Compare = A['compare']

		type ExpectedRead = {
			a: ErrorDirectNested
			b: ErrorDirectNested
			c: ErrorDirectNested
			d: ErrorDirectNested
		}

		type ExpectedCompare = {
			a: ErrorDirectNested
			b: ErrorDirectNested
			c: ErrorDirectNested
			d: ErrorDirectNested
		}

		type ExpectedWrite = {
			a: ErrorDirectNested
			b: ErrorDirectNested
			c: ErrorDirectNested
			d: ErrorDirectNested
		}

		type ExpectedWriteFlatten = {
			a: ErrorDirectNested
			b: ErrorDirectNested
			c: ErrorDirectNested
			d: ErrorDirectNested
		}

		IsTrue<IsSame<ExpectedRead, Read>>()
		IsTrue<IsSame<ExpectedWrite, Write>>()
		IsTrue<IsEqual<ExpectedWriteFlatten, WriteFlatten>>()
		IsTrue<IsEqual<ExpectedCompare, Compare>>()
	})

	it('test Geo Point, Bytes and DocumentReference ', () => {
		type Z = { a: GeoPoint; b: Bytes; c: DocumentReference<User> }
		type B = Z & {
			d: Z
			e: Z[]
			f: GeoPoint[]
			g: Bytes[]
			h: DocumentReference<User>[]
		}

		type A = MetaTypeCreator<B, string>

		type Read = A['read']
		type Write = A['write']
		type WriteFlatten = A['writeFlatten']
		type Compare = A['compare']

		type ExpectedRead = B

		type ExpectedWrite = Z & {
			d: Z
			e: readonly Z[] | ArrayUnionOrRemove<Z>
			f: readonly GeoPoint[] | ArrayUnionOrRemove<GeoPoint>
			g: readonly Bytes[] | ArrayUnionOrRemove<Bytes>
			h:
				| readonly DocumentReference<User>[]
				| ArrayUnionOrRemove<DocumentReference<User>>
		}

		type ExpectedWriteFlatten = ExpectedWrite & {
			'd.a': GeoPoint
			'd.b': Bytes
			'd.c': DocumentReference<User>
		}

		type ExpectedCompare = Z & {
			d: Z
			e: readonly Z[]
			f: readonly GeoPoint[]
			g: readonly Bytes[]
			h: readonly DocumentReference<User>[]
		} & {
			'd.a': GeoPoint
			'd.b': Bytes
			'd.c': DocumentReference<User>
		}

		IsTrue<IsSame<ExpectedRead, Read>>()
		IsTrue<IsSame<ExpectedWrite, Write>>()
		IsTrue<IsEqual<ExpectedWriteFlatten, WriteFlatten>>()
		IsTrue<IsEqual<ExpectedCompare, Compare>>()
	})
})
