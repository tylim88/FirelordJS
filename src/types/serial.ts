import { Timestamp } from './alias'
import { DocumentReference } from './refs'
import { MetaType } from './metaTypeCreator'
import { StrictPick } from './utils'

declare const SerialServerTimestampSymbol: unique symbol
declare const SerialTimestampSymbol: unique symbol
declare const SerialDateSymbol: unique symbol
declare const SerialGeoPointSymbol: unique symbol
declare const SerialDocumentReferenceSymbol: unique symbol

type SerialServerTimestampSymbol = typeof SerialServerTimestampSymbol
type SerialTimestampSymbol = typeof SerialTimestampSymbol
type SerialDateSymbol = typeof SerialDateSymbol
type SerialGeoPointSymbol = typeof SerialGeoPointSymbol
type SerialDocumentReferenceSymbol = typeof SerialDocumentReferenceSymbol

declare class Serial<T> {
	Firelord_Serial: T
}

export interface SerialServerTimestamp
	extends Serial<SerialServerTimestampSymbol> {}

export interface SerialDate extends Serial<SerialDateSymbol> {}

export interface SerialTimestamp
	extends StrictPick<Timestamp, 'nanoseconds' | 'seconds'>,
		Serial<SerialTimestampSymbol> {}

export interface SerialGeoPoint extends Serial<SerialGeoPointSymbol> {
	latitude: number
	longitude: number
}

export interface SerialDocumentReference<T extends MetaType>
	extends StrictPick<DocumentReference<T>, 'type'>,
		Serial<SerialDocumentReferenceSymbol> {}
