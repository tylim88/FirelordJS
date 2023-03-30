import { RulesTestContext } from '@firebase/rules-unit-testing'

export type Firestore_ = ReturnType<FirebaseFirestore['getFirestore']> // ! OriFirebaseFirestore['Firestore'] doesn't work even though they are the exact same type???

export type FirestoreTesting = ReturnType<RulesTestContext['firestore']>

export type FirebaseFirestore = typeof import('firebase/firestore')

export type Firestore = Firestore_ | FirestoreTesting

export type DocumentData = import('firebase/firestore').DocumentData

export type OriSetOptions = import('firebase/firestore').SetOptions

export type FirestoreError = import('firebase/firestore').FirestoreError

export type SnapshotOptions = import('firebase/firestore').SnapshotOptions

export type SnapshotMetadata = import('firebase/firestore').SnapshotMetadata

export type QueryConstraint = import('firebase/firestore').QueryConstraint

export type SnapshotListenOptions =
	import('firebase/firestore').SnapshotListenOptions

export type Unsubscribe = import('firebase/firestore').Unsubscribe

export type DocumentChangeType = import('firebase/firestore').DocumentChangeType

export type OrderByDirection = import('firebase/firestore').OrderByDirection

export type WhereFilterOp = import('firebase/firestore').WhereFilterOp

export type QueryCompositeFilterConstraint =
	import('firebase/firestore').QueryCompositeFilterConstraint

/**
 * An immutable object representing a geographic location in Firestore. The location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90]. Longitude values are in the range of [-180, 180].
 */
export type GeoPoint = FirebaseFirestore['GeoPoint']

/**
 * An immutable object representing an array of bytes.
 */
export type Bytes = FirebaseFirestore['Bytes']

/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 */
export type Timestamp = import('firebase/firestore').Timestamp

export type TransactionOptions = import('firebase/firestore').TransactionOptions

export type OriDocumentReference<T extends DocumentData = DocumentData> =
	import('firebase/firestore').DocumentReference<T>

export type OriCollectionReference<T extends DocumentData = DocumentData> =
	import('firebase/firestore').CollectionReference<T>

export type OriQuery<T extends DocumentData = DocumentData> =
	import('firebase/firestore').Query<T>

export type OriQuerySnapshot<T = DocumentData> =
	import('firebase/firestore').QuerySnapshot<T>

export type OriQueryDocumentSnapshot<T = DocumentData> =
	import('firebase/firestore').QueryDocumentSnapshot<T>

export type OriDocumentSnapshot<T extends DocumentData = DocumentData> =
	import('firebase/firestore').DocumentSnapshot<T>

export type OriDocumentChange<T = DocumentData> =
	import('firebase/firestore').DocumentChange<T>

export type OriWriteBatch = import('firebase/firestore').WriteBatch

export type OriTransaction = import('firebase/firestore').Transaction

export type OriFieldValue = import('firebase/firestore').FieldValue
