import {
	ErrorDeleteFieldMerge,
	ErrorDeleteFieldUnion,
	ErrorEmptyUpdate,
	ErrorUnknownMember,
	ErrorNonTopLevelDeleteField,
	ErrorKeyNotExist,
} from './error'
import { ArrayUnionOrRemove, Delete } from './fieldValues'
import { DeepValue } from './objectFlatten'
import { DeepPartialExceptArray, ReMap, RemoveOptionalNever } from './utils'

export type HandleUnknownMember<
	T extends Record<string, unknown>,
	Data
> = ReMap<
	Omit<Data, Exclude<keyof Data, keyof T>> & {
		[K in Exclude<keyof Data, keyof T>]: ErrorUnknownMember<K> extends Data[K]
			? never
			: ErrorUnknownMember<K>
	}
>

type IsSetDeleteAbleFieldValueValid<
	T,
	Data,
	K extends string,
	Merge extends boolean | string[]
> = Merge extends false
	? T
	: Data extends Delete
	? Merge extends true
		? Delete extends Extract<T, Delete>
			? T
			: string extends Exclude<T, Delete>
			? ErrorDeleteFieldUnion<K>
			: Exclude<T, Delete> | ErrorDeleteFieldMerge
		: Merge extends unknown[]
		? Delete extends Extract<T, Delete>
			? T
			: string extends Exclude<T, Delete>
			? ErrorDeleteFieldUnion<K>
			: Exclude<T, Delete> | ErrorDeleteFieldMerge
		: T
	: T

// type checking for array in update operation
type ExactOptionalArray<T, Data> = T extends (infer ElementOfBase)[]
	? Data extends (infer ElementOfData)[]
		? Data extends never[]
			? T
			: ElementOfData extends ElementOfBase
			? ExactOptionalArray<ElementOfBase, ElementOfData>[]
			: T
		: T
	: T extends Record<string, unknown>
	? keyof Data extends keyof T
		? keyof T extends keyof Data
			? {
					[K in keyof T]-?: ExactOptionalArray<T[K], Data[K]>
			  }
			: T
		: HandleUnknownMember<T, Data>
	: T

type ExceptOptionalSub<
	T extends Record<string, unknown>,
	K,
	Data,
	Merge extends boolean | string[], // this is for set merge operation only
	NoFlatten extends boolean,
	TopLevel extends boolean
> = DeepValue<T, K & string> extends infer S
	? unknown extends S
		? ErrorKeyNotExist<K & string>
		: S[] extends (infer BaseKeyElement)[][] | ArrayUnionOrRemove<unknown>[]
		? Data[K & keyof Data] extends (infer DataKeyElement)[]
			? Data[K & keyof Data] extends never[] // https://stackoverflow.com/questions/71193522/typescript-inferred-never-is-not-never
				? DeepPartialExceptArray<S>
				: DataKeyElement extends BaseKeyElement
				? ExactOptionalArray<BaseKeyElement, DataKeyElement>[]
				: BaseKeyElement[]
			: IsSetDeleteAbleFieldValueValid<
					S,
					Data[K & keyof Data],
					K & string,
					Merge
			  >
		: S extends Record<string, unknown>
		? Data[K & keyof Data] extends infer R
			? R extends Record<string, unknown>
				? ExactOptional<S, R, Merge, NoFlatten, false>
				: DeepPartialExceptArray<S>
			: never
		: Data[K & keyof Data] extends Delete
		? NoFlatten extends true
			? TopLevel extends false
				? ErrorNonTopLevelDeleteField
				: IsSetDeleteAbleFieldValueValid<
						S,
						Data[K & keyof Data],
						K & string,
						Merge
				  >
			: IsSetDeleteAbleFieldValueValid<
					S,
					Data[K & keyof Data],
					K & string,
					Merge
			  >
		: IsSetDeleteAbleFieldValueValid<S, Data[K & keyof Data], K & string, Merge>
	: T[K & keyof T]

// type checking for non-array in update operation
export type ExactOptional<
	T extends Record<string, unknown>,
	Data_ extends Record<string, unknown>,
	Merge extends boolean | string[], // this is for set merge operation only
	NoFlatten extends boolean,
	TopLevel extends boolean
> = T extends never
	? T
	: RemoveOptionalNever<Data_> extends infer Data
	? Data extends (
			NoFlatten extends true
				? TopLevel extends true
					? Record<string, never>
					: never
				: Record<string, never>
	  )
		? ErrorEmptyUpdate | T
		: keyof Data extends (string extends keyof T ? string | number : keyof T)
		? {
				[K in keyof T]?: K extends keyof Data
					? ExceptOptionalSub<T, K, Data, Merge, NoFlatten, TopLevel>
					: string extends K
					? ExceptOptionalSub<T, K, Data, Merge, NoFlatten, TopLevel>
					: T[K]
		  }
		: HandleUnknownMember<DeepPartialExceptArray<T>, Data>
	: never

// dont need recursive as deleteField only work on top level, but this is more future proof
// for non merge field set only
export type RecursivelyReplaceDeleteFieldWithErrorMsg<T, Data> =
	T extends Record<string, unknown>
		? Data extends Record<string, unknown>
			? keyof Data extends (string extends keyof T ? string | number : keyof T)
				? {
						[K in keyof T]: K extends string
							? K extends keyof Data
								? T[K] extends Record<string, unknown>
									? Data[K] extends Record<string, unknown>
										? RecursivelyReplaceDeleteFieldWithErrorMsg<T[K], Data[K]>
										: T[K]
									: Data[K] extends Delete
									? Delete extends Extract<T[K], Delete>
										? string extends Exclude<T[K], Delete>
											? ErrorDeleteFieldMerge
											: Exclude<T[K], Delete> | ErrorDeleteFieldMerge
										: ErrorDeleteFieldMerge
									: T[K]
								: T[K]
							: never // impossible route
				  }
				: HandleUnknownMember<T, Data>
			: T
		: T
