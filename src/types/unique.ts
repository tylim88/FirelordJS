const serverTimestampSymbol: unique symbol = Symbol()
const deleteFieldSymbol: unique symbol = Symbol()
const incrementSymbol: unique symbol = Symbol()
const possiblyReadAsUndefinedSymbol: unique symbol = Symbol()
const arraySymbol: unique symbol = Symbol()
const documentIdSymbol: unique symbol = Symbol()

export type ServerTimestampSymbol = typeof serverTimestampSymbol
export type DeleteFieldSymbol = typeof deleteFieldSymbol
export type IncrementSymbol = typeof incrementSymbol
export type PossiblyReadAsUndefinedSymbol = typeof possiblyReadAsUndefinedSymbol
export type ArraySymbol = typeof arraySymbol
export type DocumentIdSymbol = typeof documentIdSymbol
