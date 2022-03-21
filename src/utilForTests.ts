import { getFirelord } from '.'
import { Timestamp } from 'firebase/firestore'
import {
	MetaTypeCreator,
	ServerTimestamp,
	DocumentReference,
	DeleteField,
	DocumentSnapshot,
} from './types'
import { initializeApp as initializeApp_ } from 'firebase/app'
import pick from 'pick-random'
import betwin from 'betwin'
import { getDoc } from './operations'
import { flatten } from './utils'
import { cloneDeep } from 'lodash'

export const initializeApp = () => {
	const env = process.env
	const config = {
		projectId: env.PROJECT_ID,
	}
	return initializeApp_(config)
}
import { arrayUnion, increment, serverTimestamp } from './fieldValue'

export const userRefCreator = () =>
	getFirelord()<User>(`topLevel/FirelordTest/Users`)

export type Parent = MetaTypeCreator<
	{
		a: 1
	},
	'topLevel',
	'FirelordTest'
>

export type User = MetaTypeCreator<
	{
		age: number
		beenTo: (
			| Record<'US', ('Hawaii' | 'California')[]>
			| Record<'China', ('Guangdong' | 'Shanghai')[]>
		)[]
		name: string
		role: 'admin' | 'editor' | 'visitor'
		a: {
			b: { c: number; f: { g: boolean; h: Date; m: number }[] }
			i: { j: number | DeleteField; l: Date }
			e: string[]
			k: ServerTimestamp | DeleteField
		}
	},
	'Users',
	string,
	Parent
>

export const generateRandomData = (): User['write'] => {
	// do not change the value here as many tests depend on it
	const beenTo = (pick([[{ China: ['Guangdong'] }], [{ US: ['california'] }]], {
		count: pick([1, 2])[0],
	})[0] || []) as (
		| {
				US: ('Hawaii' | 'California')[]
		  }
		| {
				China: ('Guangdong' | 'Shanghai')[]
		  }
	)[]

	const name = pick(['abc', 'efg'])[0] || 'jkl'
	const role = (pick(['admin', 'editor', 'visitor'])[0] || 'admin') as
		| 'admin'
		| 'editor'
		| 'visitor'
	const age = Math.random()
	const a = {
		b: {
			c: Math.random(),
			f: [{ g: !pick([true, false])[0], h: new Date(), m: 2 }],
		},
		e: arrayUnion(
			...pick(['a', ...betwin('a', 'z'), 'z'], {
				count: pick([0, ...betwin(0, 9), 9])[0],
			})
		),
		i: { j: increment(1), l: new Date() },
		k: serverTimestamp(),
	}

	return { beenTo, name, role, age, a }
}

export const readThenCompareWithWriteData = async (
	writeData: User['write'],
	ref: DocumentReference<User>
) => {
	const docSnap = await getDoc(ref)
	compareReadAndWriteData(writeData, docSnap)
}

export const compareReadAndWriteData = (
	writeData: User['write'],
	docSnap: DocumentSnapshot<User>
) => {
	const data = cloneDeep(writeData)
	const readData = docSnap.data()
	const exists = docSnap.exists()
	expect(exists).toBe(true)
	expect(readData).not.toBe(undefined)
	if (readData) {
		// convert date
		data.a.b.f = (
			data.a.b.f as {
				g: boolean
				h: Date | Timestamp
				m: number
			}[]
		).map(item => {
			item.h = Timestamp.fromDate(item.h as Date)
			return item
		})
		// convert field value
		data.a.i.l = Timestamp.fromDate(data.a.i.l as Date)
		data.a.e = docSnap.get('a.e') as string[]
		data.a.i.j = docSnap.get('a.i.j') as number
		data.a.k = docSnap.get('a.k') as unknown as ServerTimestamp

		expect(readData).toEqual(data)

		const fieldPaths: Parameters<typeof docSnap.get>[0][] = [
			'age',
			'beenTo',
			'name',
			'role',
			'a.e',
			'a.k',
			'a.b.c',
			'a.b.f',
			'a.i.j',
			'a.i.l',
		]
		const flattenData = flatten(readData)
		fieldPaths.forEach(fieldPath => {
			expect({ data: docSnap.get(fieldPath), fieldPath }).toEqual({
				data: flattenData[fieldPath],
				fieldPath,
			})
		})
	}
}

export const writeThenReadTest = async (
	writeCallback: (
		data: ReturnType<typeof generateRandomData>
	) => Promise<DocumentReference<User>>
) => {
	const data = generateRandomData()

	const ref = await writeCallback(data)
	await readThenCompareWithWriteData(data, ref)
}
