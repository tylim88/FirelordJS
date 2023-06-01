import { RulesTestContext } from '@firebase/rules-unit-testing'

/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
export type Firestore_ = ReturnType<FirebaseFirestore['getFirestore']> // ! FirebaseFirestore['Firestore'] doesn't work even though they are the exact same type???

/**
 * a `Firestore` instance configured to connect to the emulator
 */
export type FirestoreTesting = ReturnType<RulesTestContext['firestore']>

/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
export type FirebaseFirestore = typeof import('firebase/firestore')

/**
 * The Cloud Firestore service interface or a `Firestore` instance configured to connect to the emulator.
 */
export type Firestore = Firestore_ | FirestoreTesting

/**
 * Document data (for use with {@link @firebase/firestore/lite#(setDoc:1)}) consists of fields mapped to
 * values.
 */
export type DocumentData = import('firebase/firestore').DocumentData

/** An error returned by a Firestore operation. */
export type FirestoreError = import('firebase/firestore').FirestoreError

/**
 * Options that configure how data is retrieved from a `DocumentSnapshot` (for
 * example the desired behavior for server timestamps that have not yet been set
 * to their final value).
 */
export type SnapshotOptions = import('firebase/firestore').SnapshotOptions

/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */
export type SnapshotMetadata = import('firebase/firestore').SnapshotMetadata

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
export type QueryConstraint = import('firebase/firestore').QueryConstraint

/**
 * An options object that can be passed to {@link (onSnapshot:1)} and {@link
 * QuerySnapshot.docChanges} to control which types of changes to include in the
 * result set.
 */
export type SnapshotListenOptions =
	import('firebase/firestore').SnapshotListenOptions

/**
 * A function returned by `onSnapshot()` that removes the listener when invoked.
 */
export type Unsubscribe = import('firebase/firestore').Unsubscribe

/**
 * The type of a `DocumentChange` may be 'added', 'removed', or 'modified'.
 */
export type DocumentChangeType = import('firebase/firestore').DocumentChangeType

/**
 * The direction of a {@link orderBy} clause is specified as 'desc' or 'asc'
 * (descending or ascending).
 */
export type OrderByDirection = import('firebase/firestore').OrderByDirection

/**
 * Filter conditions in a {@link where} clause are specified using the
 * strings '&lt;', '&lt;=', '==', '!=', '&gt;=', '&gt;', 'array-contains', 'in',
 * 'array-contains-any', and 'not-in'.
 */
export type WhereFilterOp = import('firebase/firestore').WhereFilterOp

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

/**
 * Options to customize transaction behavior.
 */
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

export type OriSetOptions = import('firebase/firestore').SetOptions

export type OriWriteBatch = import('firebase/firestore').WriteBatch

export type OriTransaction = import('firebase/firestore').Transaction

export type OriFieldValue = import('firebase/firestore').FieldValue

export type OriQueryCompositeFilterConstraint =
	import('firebase/firestore').QueryCompositeFilterConstraint
