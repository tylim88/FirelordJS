/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
	testEnvironment: 'node', // https://github.com/facebook/jest/issues/7780#issuecomment-645989788
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
	transform: {
		'^.+\\.(js|ts)$': ['babel-jest'],
	}, // ts-jest causing coverage issue, use babel-jest instead
	collectCoverage: true,
	collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
	setupFiles: ['dotenv/config'],
	forceExit: true,
	transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
}
