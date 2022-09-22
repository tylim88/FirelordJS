export type StrictOmit<T, Key extends keyof T> = Omit<T, Key>

export type StrictExclude<T, U extends T> = Exclude<T, U>

// https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union
type UnionToIntersection<U> = (
	U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IsTrue = <T extends true>() => {
	//
} // for type assertion, normally use with IsSame or IEqual

export type ReMap<T> = T extends Record<string, unknown>
	? { [Key in keyof T]: T[Key] }
	: T

// https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
export type IsSame<T, U> = ReMap<T> extends infer RT
	? ReMap<U> extends infer RU
		? (<G>() => G extends RT ? 1 : 2) extends <G>() => G extends RU ? 1 : 2
			? true
			: false
		: never
	: never

export type IsEqual<T, U> = T[] extends U[]
	? U[] extends T[]
		? true
		: false
	: false

export type GetOddOrEvenSegments<
	T extends string,
	ToGet extends boolean = true,
	ACC extends string[] = []
> = ToGet extends true
	? T extends `${infer H extends string}/${infer R extends string}`
		? GetOddOrEvenSegments<R, false, [...ACC, H]>
		: [...ACC, T]
	: T extends `${string}/${infer R extends string}`
	? GetOddOrEvenSegments<R, true, ACC>
	: ACC
