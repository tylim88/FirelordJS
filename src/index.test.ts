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
	it('test pass', () => {
		;() => {
			getFirelord<User>()(`topLevel/FirelordTest/Users`)
			getFirelord<Child>()('parent/123/child')
		}
	})
	it('test incorrect collection', () => {
		;() => {
			getFirelord<User>()(
				// @ts-expect-error
				`topLevel//Users`
			)
			getFirelord<User>()(
				// @ts-expect-error
				`topLevel/123/Users`
			)
			getFirelord<Child>()(
				// @ts-expect-error
				'parent//child'
			).collection()

			getFirelord<Child>()(
				// @ts-expect-error
				'parent/123/456/child'
			)
		}
	})
	it('test collection path type', () => {
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
