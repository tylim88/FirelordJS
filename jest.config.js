/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
	transform: {
		'^.+\\.(js|ts)$': ['babel-jest'],
	}, // ts-jest causing coverage issue, use babel-jest instead
	moduleDirectories: ['node_modules', 'src'],
	collectCoverage: true,
	collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
	setupFiles: ['dotenv/config'],
}
