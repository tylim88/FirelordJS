/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
	transform: {
		'^.+\\.(ts)$': 'ts-jest',
	},
	moduleDirectories: ['node_modules'],
	collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
	setupFiles: ['dotenv/config'],
}
