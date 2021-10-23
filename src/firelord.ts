export type OmitKeys<T, K extends keyof T> = Omit<T, K>

export type RemoveArray<T extends unknown[]> = T extends (infer A)[] ? A : never

export type ExcludePropertyKeys<A, U = undefined> = string &
	{
		[P in keyof A]: A[P] extends U ? never : P
	}[keyof A]

type IncludeKeys<T, K extends keyof T> = { [Y in K]: T[Y] }

type DistributeNoUndefined<T, K> = T extends undefined
	? T
	: K extends undefined
	? 'value cannot be undefined, if this is intentional, please union undefined in base type'
	: K

export type PartialNoImplicitUndefined<
	L extends { [index: string]: unknown },
	T extends Partial<L>
> = IncludeKeys<
	{
		[K in keyof L]: DistributeNoUndefined<L[K], T[K]>
	},
	keyof L & keyof T
>

import { FirelordFirestore } from './firelordFirestore'

export namespace Firelord {
	export type ServerTimestamp = 'ServerTimestamp'

	// https://stackoverflow.com/questions/69628967/typescript-distribute-over-union-doesnt-work-in-index-signature

	type ArrayWriteConverter<A> = A extends (infer T)[]
		? ArrayWriteConverter<T>[]
		: A extends ServerTimestamp
		? FirelordFirestore.FieldValue
		: A extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: A

	type ReadConverter<T> = T extends (infer A)[]
		? ReadConverter<A>[]
		: T extends ServerTimestamp | Date
		? FirelordFirestore.Timestamp
		: T

	type CompareConverter<A> = A extends (infer T)[]
		? CompareConverter<T>[]
		: A extends ServerTimestamp | Date | FirelordFirestore.Timestamp
		? FirelordFirestore.Timestamp | Date
		: A

	type WriteConverter<T> = T extends (infer A)[]
		? ArrayWriteConverter<A>[] | FirelordFirestore.FieldValue
		: T extends ServerTimestamp
		? FirelordFirestore.FieldValue
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: T extends number
		? FirelordFirestore.FieldValue | number
		: T

	export type ReadWriteCreator<
		B extends { [index: string]: unknown },
		C extends string,
		D extends string,
		E extends { colPath: string; docPath: string } = {
			colPath: never
			docPath: never
		}
	> = {
		base: B
		read: {
			[J in keyof B]: ReadConverter<B[J]>
		} & {
			[index in keyof FirelordFirestore.CreatedUpdatedRead]: FirelordFirestore.CreatedUpdatedRead[index]
		} // so it looks more explicit in typescript hint
		write: {
			[J in keyof B]: WriteConverter<B[J]>
		} & {
			[index in keyof FirelordFirestore.CreatedUpdatedWrite]: FirelordFirestore.CreatedUpdatedWrite[index]
		} // so it looks more explicit in typescript hint
		compare: {
			[J in keyof B]: CompareConverter<B[J]>
		} & {
			[index in keyof FirelordFirestore.CreatedUpdatedCompare]: FirelordFirestore.CreatedUpdatedCompare[index]
		} // so it looks more explicit in typescript hint

		colPath: E extends {
			colPath: never
			docPath: never
		}
			? C
			: `${E['colPath']}/${E['docPath']}/${C}`
		docPath: D
	}

	// type a = ReadWriteCreator<
	// 	{
	// 		a:
	// 			| string
	// 			| Date
	// 			| number[]
	// 			| (string | number)[]
	// 			| (string | Date)[][]
	// 			| (string | number)[][][]
	// 	},
	// 	string,
	// 	string
	// >

	// type b = a['write']
	// type c = a['read']
	// type f = a['compare']

	// type d = string[] & (string | number)[]
}
