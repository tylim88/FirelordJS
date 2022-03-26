import {
	ErrorDeleteFieldMerge,
	ErrorDeleteFieldMergeField,
	ErrorEmptyUpdate,
	ErrorSetDeleteFieldMustAtTopLevel,
	ErrorUnknownMember,
} from './error'
import { ArrayUnionOrRemove, DeleteField } from './fieldValue'

type HandleUnknownMember<T extends Record<string, unknown>, Data> = Omit<
	Data,
	Exclude<keyof Data, keyof T>
> & {
	[K in Exclude<keyof Data, keyof T>]: ErrorUnknownMember<K> extends Data[K]
		? never
		: ErrorUnknownMember<K>
}

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
export type PartialNoUndefinedAndNoUnknownMember<
	T extends Record<string, unknown>,
	Data extends Record<string, unknown>,
	Merge extends boolean | string[], // this is for set operation only
	IsSetDeleteFieldAtTopLevel extends boolean // this is for set operation only
> = Data extends Record<string, never>
	? ErrorEmptyUpdate | T
	: keyof Data extends keyof T
	? {
			[K in keyof T & keyof Data]-?: T[K] extends Record<string, unknown>
				? Data[K] extends Record<string, unknown>
					? PartialNoUndefinedAndNoUnknownMember<T[K], Data[K], Merge, false>
					: T[K]
				: T[K] extends (infer BaseKeyElement)[] | ArrayUnionOrRemove
				? Data[K] extends (infer DataKeyElement)[]
					? Data[K] extends never[] // https://stackoverflow.com/questions/71193522/typescript-inferred-never-is-not-never
						? T[K]
						: DataKeyElement extends BaseKeyElement
						? PartialNoUndefinedAndNoUnknownMemberInArray<
								BaseKeyElement,
								DataKeyElement
						  >[]
						: BaseKeyElement[]
					: IsSetDeleteAbleFieldValueValid<
							T[K],
							Data[K],
							K & string,
							Merge,
							IsSetDeleteFieldAtTopLevel
					  >
				: IsSetDeleteAbleFieldValueValid<
						T[K],
						Data[K],
						K & string,
						Merge,
						IsSetDeleteFieldAtTopLevel
				  >
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
										? Exclude<T[K], DeleteField> | ErrorDeleteFieldMerge<K>
										: T[K]
									: T[K]
								: T[K]
							: never // impossible route
				  }
				: HandleUnknownMember<T, Data>
			: T
		: T

type IsSetDeleteAbleFieldValueValid<
	T,
	Data,
	Key extends string,
	Merge extends boolean | string[],
	IsSetDeleteFieldAtTopLevel extends boolean
> = Merge extends false
	? T
	: Data extends DeleteField
	? IsSetDeleteFieldAtTopLevel extends false
		? ErrorSetDeleteFieldMustAtTopLevel | Exclude<T, DeleteField>
		: Merge extends true
		? T
		: Merge extends false
		? ErrorDeleteFieldMerge<Key> | Exclude<T, DeleteField> // only show error when condition failed
		: Merge extends (infer P)[]
		? Key extends P
			? T
			: ErrorDeleteFieldMergeField<Key> | Exclude<T, DeleteField> // only show error when condition failed
		: T
	: T
