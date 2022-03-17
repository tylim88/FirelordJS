import {
	ErrorDeleteFieldMerge,
	ErrorDeleteFieldMergeField,
	ErrorEmptyUpdate,
	ErrorSetDeleteFieldMustAtTopLevel,
	ErrorUnknownMember,
} from './error'
import { ArrayFieldValue, DeleteAbleFieldValue } from './fieldValue'

// check unknown member in stale value for set
export type FindUnknownMemberInStaleValue<T, Data> = T extends Record<
	string,
	unknown
>
	? keyof Data extends keyof T
		? keyof T extends keyof Data
			? {
					[K in keyof T]-?: FindUnknownMemberInStaleValue<T[K], Data[K]>
			  }
			: T
		: ErrorUnknownMember<Exclude<keyof Data, keyof T>>
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
			: T
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
				: T[K] extends (infer BaseKeyElement)[] | ArrayFieldValue
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
	: ErrorUnknownMember<Exclude<keyof Data, keyof T>>

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
									: Data[K] extends DeleteAbleFieldValue
									? DeleteAbleFieldValue extends Extract<
											T[K],
											DeleteAbleFieldValue
									  >
										?
												| Exclude<T[K], DeleteAbleFieldValue>
												| ErrorDeleteFieldMerge<K>
										: T[K]
									: T[K]
								: T[K]
							: never // impossible route
				  }
				: ErrorUnknownMember<Exclude<keyof Data, keyof T>>
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
	: Data extends DeleteAbleFieldValue
	? IsSetDeleteFieldAtTopLevel extends false
		? ErrorSetDeleteFieldMustAtTopLevel | Exclude<T, DeleteAbleFieldValue>
		: Merge extends true
		? T
		: Merge extends false
		? ErrorDeleteFieldMerge<Key> | Exclude<T, DeleteAbleFieldValue> // only show error when condition failed
		: Merge extends (infer P)[]
		? Key extends P
			? T
			: ErrorDeleteFieldMergeField<Key> | Exclude<T, DeleteAbleFieldValue> // only show error when condition failed
		: T
	: T
