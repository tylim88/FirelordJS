import { TransactionOptions } from '../types'

export const isTransactionOptions = (
	value: unknown
): value is TransactionOptions => {
	return typeof value !== 'function'
}
