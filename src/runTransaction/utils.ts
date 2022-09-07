import { TransactionOptions } from '../types'

export const isTransactionOptions = (
	value: unknown
): value is TransactionOptions => {
	const v = value as Partial<TransactionOptions>
	const keyName: keyof TransactionOptions = 'maxAttempts'

	try {
		return Object.prototype.hasOwnProperty.call(v, keyName)
	} catch (err) {
		return false
	}
}
