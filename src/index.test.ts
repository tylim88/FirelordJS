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
			getFirelord<User>(`topLevel`, `Users`)
			getFirelord<Child>('parent', 'child')
		}
	})
	it('test incorrect collection', () => {
		;() => {
			getFirelord<User>(
				// @ts-expect-error
				`topLe1vel`,
				`Users`
			)
			getFirelord<User>(
				`topLevel`,
				// @ts-expect-error
				`Use1rs`
			)
			getFirelord<Child>(
				// @ts-expect-error
				'paraent',
				'child'
			).collection('abc')

			getFirelord<Child>(
				// @ts-expect-error
				'parent',
				'abc',
				'child'
			)
		}
	})
	it('test collection path type', () => {
		;() => {
			getFirelord<User>(getFirestore(), `topLevel`, `Users`).collection(
				// @ts-expect-error
				'abc'
			)
			const userRef =
				// @ts-expect-error
				getFirelord<User>('User1s')
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
