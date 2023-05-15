import {
	ErrorDeleteFieldMerge,
	ErrorDeleteFieldUnion,
	ErrorEmptyUpdate,
	ErrorUnknownMember,
	ErrorNonTopLevelDeleteField,
} from './error'
import { ArrayUnionOrRemove, DeleteField } from './fieldValue'
import { DeepValue } from './objectFlatten'

type HandleUnknownMember<T extends Record<string, unknown>, Data> = Omit<
	Data,
	Exclude<keyof Data, keyof T>
> & {
	[K in Exclude<keyof Data, keyof T>]: ErrorUnknownMember<K> extends Data[K]
		? never
		: ErrorUnknownMember<K>
}

type IsSetDeleteAbleFieldValueValid<
	T,
	Data,
	K extends string,
	Merge extends boolean | string[]
> = Merge extends false
	? T
	: Data extends DeleteField
	? Merge extends true
		? DeleteField extends Extract<T, DeleteField>
			? T
			: string extends Exclude<T, DeleteField>
			? ErrorDeleteFieldUnion<K>
			: Exclude<T, DeleteField> | ErrorDeleteFieldMerge
		: Merge extends unknown[]
		? DeleteField extends Extract<T, DeleteField>
			? T
			: string extends Exclude<T, DeleteField>
			? ErrorDeleteFieldUnion<K>
			: Exclude<T, DeleteField> | ErrorDeleteFieldMerge
		: T
	: T

// type checking for array in update operation
type PartialNoUndefinedAndNoUnknownMemberInArray<T, Data> =
	T extends (infer ElementOfBase)[]
		? Data extends (infer ElementOfData)[]
			? Data extends never[]
				? T
				: ElementOfData extends ElementOfBase
				? PartialNoUndefinedAndNoUnknownMemberInArray<
						ElementOfBase,
						ElementOfData
				  >[]
				: T
			: T
		: T extends Record<string, unknown>
		? keyof Data extends keyof T
			? keyof T extends keyof Data
				? {
						[K in keyof T]-?: PartialNoUndefinedAndNoUnknownMemberInArray<
							T[K],
							Data[K]
						>
				  }
				: T
			: HandleUnknownMember<T, Data>
		: T

// type checking for non-array in update operation
export type PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
	T extends Record<string, unknown>,
	Data extends Record<string, unknown>,
	Merge extends boolean | string[], // this is for set merge operation only
	NoFlatten extends boolean,
	TopLevel extends boolean
> = Data extends Record<string, never>
	? ErrorEmptyUpdate
	: keyof Data extends keyof T
	? {
			[K in keyof T & keyof Data]?: DeepValue<T, K & string> extends infer S
				? S[] extends Record<string, unknown>[]
					? Data[K] extends infer R
						? R extends Record<string, unknown>
							? PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
									S & Record<string, unknown>,
									R,
									Merge,
									NoFlatten,
									false
							  >
							: S
						: never
					: S[] extends
							| (infer BaseKeyElement)[][]
							| ArrayUnionOrRemove<unknown>[]
					? Data[K] extends (infer DataKeyElement)[]
						? Data[K] extends never[] // https://stackoverflow.com/questions/71193522/typescript-inferred-never-is-not-never
							? S
							: DataKeyElement extends BaseKeyElement
							? PartialNoUndefinedAndNoUnknownMemberInArray<
									BaseKeyElement,
									DataKeyElement
							  >[]
							: BaseKeyElement[]
						: IsSetDeleteAbleFieldValueValid<S, Data[K], K & string, Merge>
					: Data[K] extends DeleteField
					? NoFlatten extends true
						? TopLevel extends false
							? ErrorNonTopLevelDeleteField
							: IsSetDeleteAbleFieldValueValid<S, Data[K], K & string, Merge>
						: IsSetDeleteAbleFieldValueValid<S, Data[K], K & string, Merge>
					: IsSetDeleteAbleFieldValueValid<S, Data[K], K & string, Merge>
				: never
	  }
	: HandleUnknownMember<T, Data>

// dont need recursive as deleteField only work on top level, but this is more future proof
// for non merge field set only
export type RecursivelyReplaceDeleteFieldWithErrorMsg<T, Data> =
	T extends Record<string, unknown>
		? Data extends Record<string, unknown>
			? keyof Data extends keyof T
				? {
						[K in keyof T]: K extends string
							? K extends keyof Data
								? T[K] extends Record<string, unknown>
									? Data[K] extends Record<string, unknown>
										? RecursivelyReplaceDeleteFieldWithErrorMsg<T[K], Data[K]>
										: T[K]
									: Data[K] extends DeleteField
									? DeleteField extends Extract<T[K], DeleteField>
										? string extends Exclude<T[K], DeleteField>
											? ErrorDeleteFieldMerge
											: Exclude<T[K], DeleteField> | ErrorDeleteFieldMerge
										: ErrorDeleteFieldMerge
									: T[K]
								: T[K]
							: never // impossible route
				  }
				: HandleUnknownMember<T, Data>
			: T
		: T
