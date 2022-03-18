/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharedConfig = require('./jest.config.js')
module.exports = {
	...sharedConfig,
	roots: ['<rootDir>/codeForDoc'],
	collectCoverage: false,
}
