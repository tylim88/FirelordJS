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

// type GetEndName<T extends string | number | symbol> =
// 	T extends `${infer Prop}.${infer Rest}` ? GetEndName<Rest> : T

// type GetSpecialObjectKeyName<T extends Record<string, unknown>> = {
// 	[K in keyof T]: T[K] extends
// 		| FirelordFirestore.GeoPoint
// 		| FirelordFirestore.Timestamp
// 		| Date
// 		| FirelordFirestore.FieldValue
// 		? GetEndName<K>
// 		: T[K] extends Record<string, unknown>
// 		? GetSpecialObjectKeyName<T[K]> extends string
// 			? GetSpecialObjectKeyName<T[K]>
// 			: never
// 		: never
// }

// type ConstructMirrorObject<T extends string> = {
// 	[K in T]: K
// }

// type ElseOnlyEmptyObject<T extends Record<string, unknown>> =
// 	ConstructMirrorObject<
// 		GetSpecialObjectKeyName<ObjectFlatten<T>>[keyof ObjectFlatten<T>]
// 	> extends Record<string, never>
// 		? Record<string, never>
// 		: ConstructMirrorObject<
// 				GetSpecialObjectKeyName<ObjectFlatten<T>>[keyof ObjectFlatten<T>]
// 		  >

// type EndNameFullNamePair<T extends Record<string, unknown>> = {
// 	[K in keyof T as GetEndName<K>]: K
// }
// https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union
// type UnionToIntersection<U> = (
// 	U extends unknown ? (k: U) => void : never
// ) extends (k: infer I) => void
// 	? I
// 	: never

// type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// type CheckObjectHasUnion<T extends Record<string, unknown>> = {
// 	[K in keyof T]: IsUnion<T[K]>
// }

// export type CheckObjectHasDuplicateEndName<T extends Record<string, unknown>> =
// 	true extends CheckObjectHasUnion<
// 		EndNameFullNamePair<ObjectFlatten<T>>
// 	>[keyof CheckObjectHasUnion<EndNameFullNamePair<ObjectFlatten<T>>>]
// 		? never
// 		: T

export const flatten = <T extends Record<string, unknown>>(
	object: T
	// object: CheckObjectHasDuplicateEndName<T>
	// exclude: ElseOnlyEmptyObject<T>
) => {
	let obj = {}

	const flat = (object: Record<string, unknown>, key: string) => {
		for (const prop in object) {
			const newKey = (key ? key + '.' : key) + prop
			if (
				!Array.isArray(object[prop]) &&
				typeof object[prop] === 'object' &&
				object[prop] !== null &&
				!Object.getOwnPropertyNames(
					Object.getPrototypeOf(object[prop])
				).includes('constructor')
				// !Object.keys(exclude).includes(prop)
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
