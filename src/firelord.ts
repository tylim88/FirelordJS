import { FirelordFirestore } from './firelordFirestore'
import { DeepRequired } from 'ts-essentials'

export type OmitKeys<T, K extends keyof T> = Omit<T, K>

export type RemoveArray<T extends unknown[]> = T extends (infer A)[] ? A : never

// use ts-essentials DeepRequired because it has cleaner typescript hint
// export type DeepRequired<T> = Required<{
// 	[P in keyof T]: T[P] extends Record<string, unknown>
// 		? DeepRequired<T[P]>
// 		: T[P] extends (infer A)[]
// 		? DeepRequired<A>[]
// 		: T[P]
// }>

export type ExcludePropertyKeys<A, U = undefined> = string &
	{
		[P in keyof A]: A[P] extends U ? never : P
	}[keyof A]

type DistributeNoUndefined<T, K> = T extends undefined
	? T
	: K extends undefined
	? 'value cannot be undefined, if this is intentional, please union undefined in base type'
	: K

export type PartialNoImplicitUndefinedAndNoExtraMember<
	L extends { [index: string]: unknown },
	T extends Partial<L>
> = keyof T extends keyof L
	? {
			[K in keyof L & keyof T]: L[K] extends Record<string, unknown>
				? T[K] extends Partial<L[K]>
					? PartialNoImplicitUndefinedAndNoExtraMember<L[K], T[K]>
					: never
				: L[K] extends (infer A)[]
				? T[K] extends (infer B)[]
					? A extends Record<string, unknown>
						? B extends Partial<A>
							? PartialNoImplicitUndefinedAndNoExtraMember<A, B>[]
							: never
						: B extends A
						? DistributeNoUndefined<A, B>[]
						: never[]
					: never
				: DistributeNoUndefined<L[K], T[K]>
	  }
	: never

export namespace Firelord {
	export type ServerTimestamp = 'ServerTimestamp'
	export type ServerTimestampMasked = {
		'please import `serverTimestamp` from `firelord` and call it': ServerTimestamp
	}
	export type NumberMasked = {
		'please import `increment` from `firelord` and call it': number
	}
	export type ArrayMasked<T> = {
		'please import `arrayUnion` or `arrayRemove` from `firelord` and call it': T
	}

	export type CreatedUpdatedWrite = {
		createdAt: FirelordFirestore.FieldValue
		updatedAt: FirelordFirestore.FieldValue
	}
	export type CreatedUpdatedRead = {
		createdAt: FirelordFirestore.Timestamp
		updatedAt: FirelordFirestore.Timestamp | null
	}
	export type CreatedUpdatedCompare = {
		createdAt: Date | FirelordFirestore.Timestamp
		updatedAt: Date | FirelordFirestore.Timestamp | null
	}

	// https://javascript.plainenglish.io/using-firestore-with-more-typescript-8058b6a88674
	type DeepKey<T, K extends keyof T> = K extends string
		? // Date, timestamp and geo point will never extends Record<string, unknown>, so we dont need these lines
		  // ! however why these lines trigger <Type instantiation is excessively deep and possibly infinite> error if enabled? how is this possible?
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

	export type FlattenObject<T extends Record<string, unknown>> = {
		[TKey in DeepKeyS<DeepRequired<T>>]: DeepValue<DeepRequired<T>, TKey>
	}

	// https://stackoverflow.com/questions/69628967/typescript-distribute-over-union-doesnt-work-in-index-signature

	type ArrayWriteConverter<T> = T extends (infer A)[]
		? ArrayWriteConverter<A>[]
		: T extends ServerTimestamp
		? never
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: T extends Record<string, unknown>
		? {
				[K in keyof T]: ArrayWriteConverter<T[K]>
		  }
		: T

	type ReadConverter<T> = T extends (infer A)[]
		? ReadConverter<A>[]
		: T extends ServerTimestamp | Date | FirelordFirestore.Timestamp
		? FirelordFirestore.Timestamp
		: T extends Record<string, unknown>
		? {
				[K in keyof T]: ReadConverter<T[K]>
		  }
		: T

	type CompareConverter<T> = T extends (infer A)[]
		? CompareConverter<A>[]
		: T extends ServerTimestamp | Date | FirelordFirestore.Timestamp
		? FirelordFirestore.Timestamp | Date
		: T extends Record<string, unknown>
		? {
				[K in keyof T]: CompareConverter<T[K]>
		  }
		: T

	type WriteConverter<T> = T extends (infer A)[]
		? ArrayWriteConverter<A>[] | ArrayMasked<ArrayWriteConverter<A>>
		: T extends ServerTimestamp
		? ServerTimestampMasked
		: T extends number
		? number | NumberMasked
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
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
		read: DeepRequired<
			ReadConverter<B> & {
				[index in keyof CreatedUpdatedRead]: CreatedUpdatedRead[index]
			}
		>
		// so it looks more explicit in typescript hint
		writeNested: DeepRequired<
			{
				[J in keyof B]: WriteConverter<B[J]>
			} & {
				[index in keyof CreatedUpdatedWrite]: CreatedUpdatedWrite[index]
			}
		>
		write: {
			[J in keyof FlattenObject<B>]: WriteConverter<FlattenObject<B>[J]>
		} & {
			[index in keyof CreatedUpdatedWrite]: CreatedUpdatedWrite[index]
		}
		// so it looks more explicit in typescript hint
		compare: {
			[J in keyof FlattenObject<B>]: CompareConverter<FlattenObject<B>[J]>
		} & {
			[index in keyof CreatedUpdatedCompare]: CreatedUpdatedCompare[index]
		}
		// so it looks more explicit in typescript hint

		colPath: E extends {
			colPath: never
			docPath: never
		}
			? C
			: `${E['colPath']}/${E['docPath']}/${C}`
		docPath: D
		colGroupPath: C
	}
}
