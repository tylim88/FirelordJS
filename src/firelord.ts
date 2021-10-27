import { FirelordFirestore } from './firelordFirestore'
import { CheckObjectHasDuplicateEndName } from './flat'
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

export type PartialNoImplicitUndefinedAndNoExtraMember<
	L extends { [index: string]: unknown },
	T extends Partial<L>
> = keyof T extends keyof L
	? IncludeKeys<
			{
				[K in keyof L]: DistributeNoUndefined<L[K], T[K]>
			},
			keyof L & keyof T
	  >
	: never

export namespace Firelord {
	export type ServerTimestamp = 'ServerTimestamp'

	// https://javascript.plainenglish.io/using-firestore-with-more-typescript-8058b6a88674
	type DeepKey<T, K extends keyof T> = K extends string
		? // Date, timestamp and geo point will never extends Record<string, unknown>, so we dont need these lines
		  // ! however why these few line cause <Type instantiation is excessively deep and possibly infinite> if enabled? WHY?
		  // T[K] extends
		  // 		| Date
		  // 		| FirelordFirestore.Timestamp
		  // 		| FirelordFirestore.GeoPoint
		  // 	? K
		  // 	:
		  T[K] extends Record<string, unknown>
			? `${K}.${DeepKey<T[K], keyof T[K]>}`
			: K
		: never

	type DeepKeyS<T> = DeepKey<T, keyof T>

	type DeepValue<
		T,
		P extends DeepKeyS<T>
	> = P extends `${infer K}.${infer Rest}`
		? K extends keyof T
			? Rest extends DeepKeyS<T[K]>
				? DeepValue<T[K], Rest>
				: never
			: never
		: P extends keyof T
		? T[P]
		: never

	type FlattenObject<T extends Record<string, unknown>> = {
		[TKey in DeepKeyS<T>]: DeepValue<T, TKey>
	}

	// https://stackoverflow.com/questions/69628967/typescript-distribute-over-union-doesnt-work-in-index-signature

	type ArrayWriteConverter<T> = T extends (infer A)[]
		? ArrayWriteConverter<A>[]
		: T extends ServerTimestamp
		? FirelordFirestore.FieldValue
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: T extends FirelordFirestore.GeoPoint
		? FirelordFirestore.GeoPoint
		: T

	type ReadConverter<T> = T extends (infer A)[]
		? ReadConverter<A>[]
		: T extends ServerTimestamp | Date
		? FirelordFirestore.Timestamp
		: T extends FirelordFirestore.GeoPoint
		? FirelordFirestore.GeoPoint
		: T

	type CompareConverter<T> = T extends (infer A)[]
		? CompareConverter<A>[]
		: T extends ServerTimestamp | Date | FirelordFirestore.Timestamp
		? FirelordFirestore.Timestamp | Date
		: T extends FirelordFirestore.GeoPoint
		? FirelordFirestore.GeoPoint
		: T

	type WriteConverter<T> = T extends (infer A)[]
		? ArrayWriteConverter<A>[] | FirelordFirestore.FieldValue
		: T extends ServerTimestamp
		? FirelordFirestore.FieldValue
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: T extends number
		? FirelordFirestore.FieldValue | number
		: T extends FirelordFirestore.GeoPoint
		? FirelordFirestore.GeoPoint
		: T

	// solve "Type instantiation is excessively deep and possibly infinite" error
	type ReadDeepConvert<T extends Record<string, unknown>> = {
		[K in keyof T]: ReadConverter<T[K]> extends Record<string, unknown>
			? ReadDeepConvert<ReadConverter<T[K]>>
			: ReadConverter<T[K]>
	}
	// ! for some reason this does not work, WHY
	// type WriteDeepConvert<T extends Record<string, unknown>> = {
	// 	[K in keyof T]: WriteConverter<T[K]> extends Record<string, unknown>
	// 		? WriteDeepConvert<WriteConverter<T[K]>>
	// 		: WriteConverter<T[K]>
	// }

	// ! for some reason this does not work. WHY
	// type CompareDeepConvert<T extends Record<string, unknown>> = {
	// 	[K in keyof T]: CompareConverter<T[K]> extends Record<string, unknown>
	// 		? CompareDeepConvert<CompareConverter<T[K]>>
	// 		: CompareConverter<T[K]>
	// }

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
		read: CheckObjectHasDuplicateEndName<
			ReadDeepConvert<B> & FirelordFirestore.CreatedUpdatedRead
			//  {
			// 	[index in keyof FirelordFirestore.CreatedUpdatedRead]: FirelordFirestore.CreatedUpdatedRead[index]
			// }
		> // so it looks more explicit in typescript hint
		write: CheckObjectHasDuplicateEndName<
			{
				[J in keyof FlattenObject<B>]: WriteConverter<FlattenObject<B>[J]>
			} & {
				[index in keyof FirelordFirestore.CreatedUpdatedWrite]: FirelordFirestore.CreatedUpdatedWrite[index]
			}
		> // so it looks more explicit in typescript hint
		compare: CheckObjectHasDuplicateEndName<
			{
				[J in keyof FlattenObject<B>]: CompareConverter<FlattenObject<B>[J]>
			} & {
				[index in keyof FirelordFirestore.CreatedUpdatedCompare]: FirelordFirestore.CreatedUpdatedCompare[index]
			}
		> // so it looks more explicit in typescript hint

		colPath: E extends {
			colPath: never
			docPath: never
		}
			? C
			: `${E['colPath']}/${E['docPath']}/${C}`
		docPath: D
	}
}
