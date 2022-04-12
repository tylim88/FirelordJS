import { getFirelord, MetaTypeCreator } from '.'
import { initializeApp, User } from './utilForTests'
import { getFirestore } from 'firebase/firestore'

initializeApp()

type parent = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'parent',
	string
>

type Child = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'child',
	string,
	parent
>

describe('test', () => {
	it('test incorrect collection', () => {
		;() =>
			getFirelord<Child>()(
				// @ts-expect-error
				'parent//child'
			).collection()
		;() =>
			getFirelord<User>()(
				// @ts-expect-error
				`topLevel//Users`
			)
	})
	it('test type', () => {
		;() => {
			getFirelord<User>(getFirestore())(
				// @ts-expect-error
				`topLevel/FirelordTest1/Users`
			)
			const userRef = getFirelord<User>()(
				// @ts-expect-error
				'User1s'
			)
			userRef.doc(
				// @ts-expect-error
				123
			)
			userRef.collection(
				// @ts-expect-error
				false
			)
			userRef.collectionGroup(
				// @ts-expect-error
				{}
			)
		}
	})
})
