import { IsTrue, IsSame } from './utils'
import { DocumentSnapshot } from './snapshot'
import { FirelordFirestore } from './firelordFirestore'
import { User } from '../utilForTests'

const documentSnapshot = 1 as unknown as DocumentSnapshot<User>
it('test return data type', () => {
	;() => {
		const data = documentSnapshot.data()
		if (data) {
			const {
				beenTo,
				name,
				role,
				age,
				a: {
					b: {
						c,
						f,
						// @ts-expect-error
						p,
					},
				},
				// @ts-expect-error
				unknown,
			} = data
		}
	}
})
it('test exists type', () => {
	;() => {
		const target = documentSnapshot.exists()
		type A = typeof target
		type B = boolean
		IsTrue<IsSame<A, B>>()
	}
})
it('test snapshot metadata type', () => {
	;() => {
		const target = documentSnapshot.metadata
		type A = typeof target
		type B = FirelordFirestore.SnapshotMetadata
		IsTrue<IsSame<A, B>>()
	}
})
it('test data type with no option', () => {
	;() => {
		const target = documentSnapshot.data()
		type A = NonNullable<typeof target>['a']['k']
		type B = User['read']['a']['k'] | null
		IsTrue<IsSame<A, B>>()
	}
})
it('test data type with estimate option', () => {
	;() => {
		const target = documentSnapshot.data({ serverTimestamps: 'estimate' })
		type A = typeof target
		type B = User['read'] | undefined
		IsTrue<IsSame<A, B>>()
	}
})
it('test data type with previous option', () => {
	;() => {
		const target = documentSnapshot.data({ serverTimestamps: 'previous' })
		type A = NonNullable<typeof target>['a']['k']
		type B = User['read']['a']['k'] | undefined | null
		IsTrue<IsSame<A, B>>()
	}
})
it('test get type with no option', () => {
	;() => {
		const target = documentSnapshot.get('a.k')
		type A = typeof target
		type B = User['read']['a']['k'] | undefined | null
		IsTrue<IsSame<A, B>>()
	}
})
it('test get type with estimate option', () => {
	;() => {
		const target = documentSnapshot.get('a.k', {
			serverTimestamps: 'estimate',
		})
		type A = typeof target
		type B = User['read']['a']['k'] | undefined
		IsTrue<IsSame<A, B>>()
	}
})
it('test get type with previous option', () => {
	;() => {
		const target = documentSnapshot.get('a.k', {
			serverTimestamps: 'previous',
		})
		type A = typeof target
		type B = User['read']['a']['k'] | undefined | null
		IsTrue<IsSame<A, B>>()
	}
})
