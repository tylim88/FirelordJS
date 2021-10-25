import { FirelordFirestore } from './firelordFirestore'

type DeepKey<T, K extends keyof T> = K extends string
	? T[K] extends Record<string, unknown>
		? `${K}.${DeepKey<T[K], keyof T[K]>}`
		: K
	: never

type DeepKeyS<T> = DeepKey<T, keyof T>

type DeepValue<T, P extends DeepKeyS<T>> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? Rest extends DeepKeyS<T[K]>
			? DeepValue<T[K], Rest>
			: never
		: never
	: P extends keyof T
	? T[P]
	: never

type ObjectFlatten<T extends Record<string, unknown>> = {
	[TKey in DeepKeyS<T>]: DeepValue<T, TKey>
}

type GetEndName<T extends string | number | symbol> =
	T extends `${infer Prop}.${infer Rest}` ? GetEndName<Rest> : T

type GetSpecialObjectKeyName<T extends Record<string, unknown>> = {
	[K in keyof T]: T[K] extends
		| FirelordFirestore.GeoPoint
		| FirelordFirestore.Timestamp
		| Date
		| FirelordFirestore.FieldValue
		? GetEndName<K>
		: T[K] extends Record<string, unknown>
		? GetSpecialObjectKeyName<T[K]> extends string
			? GetSpecialObjectKeyName<T[K]>
			: never
		: never
}

type ConstructMirrorObject<T extends string> = {
	[K in T]: K
}

type ElseOnlyEmptyObject<T extends Record<string, unknown>> =
	ConstructMirrorObject<
		GetSpecialObjectKeyName<ObjectFlatten<T>>[keyof ObjectFlatten<T>]
	> extends Record<string, never>
		? Record<string, never>
		: ConstructMirrorObject<
				GetSpecialObjectKeyName<ObjectFlatten<T>>[keyof ObjectFlatten<T>]
		  >

type EndNameFullNamePair<T extends Record<string, unknown>> = {
	[K in keyof T as GetEndName<K>]: K
}
// https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union
type UnionToIntersection<U> = (
	U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
	? I
	: never

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

type CheckObjectHasUnion<T extends Record<string, unknown>> = {
	[K in keyof T]: IsUnion<T[K]>
}

export type CheckObjectHasDuplicateEndName<T extends Record<string, unknown>> =
	true extends CheckObjectHasUnion<
		EndNameFullNamePair<ObjectFlatten<T>>
	>[keyof CheckObjectHasUnion<EndNameFullNamePair<ObjectFlatten<T>>>]
		? never
		: T

export const flatten = <T extends Record<string, unknown>>(
	object: CheckObjectHasDuplicateEndName<T>,
	exclude: ElseOnlyEmptyObject<T>
) => {
	let obj = {}

	const flat = (object: Record<string, unknown>, key: string) => {
		for (const prop in object) {
			const newKey = (key ? key + '.' : key) + prop
			if (
				!Array.isArray(object[prop]) &&
				typeof object[prop] === 'object' &&
				object[prop] !== null &&
				!Object.keys(exclude).includes(prop)
			) {
				flat(object[prop] as Record<string, unknown>, newKey)
			} else {
				obj = { ...obj, [newKey]: object[prop] }
			}
		}
	}

	flat(object, '')

	return obj as ObjectFlatten<T>
}

// type a = { a: 1; b: Date; c: { d: Date; e: { f: Date; j: 1 } } }

// type c = GetSpecialObjectKeyName<a>[keyof a]

// type d<T extends Record<string, unknown>> = ConstructMirrorObject<
// 	GetSpecialObjectKeyName<ObjectFlatten<T>>[keyof ObjectFlatten<T>]
// >

// type e = d<a>
// type f = { a: Date; b: 2; c: { d: 1; e: 2; f: { g: 1; h: Date; a: 2 } } }
// type g = d<f>

// type i = CheckObjectHasUnion<EndNameFullNamePair<ObjectFlatten<f>>>
// type l = CheckObjectHasDuplicateEndName<f>
// flatten(
// 	{
// 		a: new Date(0),
// 		b: 2,
// 		c: { d: 1, e: 2, f: { g: 1, h: new Date(0), al: 2 } },
// 	},
// 	{ a: 'a', h: 'h' }
// )
// type oo = ConstructMirrorObject<
// 	GetSpecialObjectKeyName<ObjectFlatten<{ a: 1 }>>[keyof ObjectFlatten<{
// 		a: 1
// 	}>]
// >
// flatten({ a: new Date() }, { a: 'a' })

// type ii = {} extends {} ? true : false
