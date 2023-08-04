import { Timestamp } from './alias'
import { DocumentReference } from './refs'
import { MetaType } from './metaTypeCreator'
import { StrictPick } from './utils'

declare const JSONServerTimestampSymbol: unique symbol
declare const JSONTimestampSymbol: unique symbol
declare const JSONDateSymbol: unique symbol
declare const JSONGeoPointSymbol: unique symbol
declare const JSONDocumentReferenceSymbol: unique symbol

type JSONServerTimestampSymbol = typeof JSONServerTimestampSymbol
type JSONTimestampSymbol = typeof JSONTimestampSymbol
type JSONDateSymbol = typeof JSONDateSymbol
type JSONGeoPointSymbol = typeof JSONGeoPointSymbol
type JSONDocumentReferenceSymbol = typeof JSONDocumentReferenceSymbol

declare class JSON<T> {
	protected Firelord_JSON: T
}

export interface JSONServerTimestamp extends JSON<JSONServerTimestampSymbol> {}

export interface JSONDate extends JSON<JSONDateSymbol> {}

export interface JSONTimestamp
	extends StrictPick<Timestamp, 'nanoseconds' | 'seconds'>,
		JSON<JSONTimestampSymbol> {}

export interface JSONGeoPoint extends JSON<JSONGeoPointSymbol> {
	latitude: number
	longitude: number
}

export interface JSONDocumentReference<T extends MetaType>
	extends StrictPick<DocumentReference<T>, 'type'>,
		JSON<JSONDocumentReferenceSymbol> {}
