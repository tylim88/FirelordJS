import type { KnipConfig } from 'knip'

const config: KnipConfig = {
	entry: ['src/index.ts', 'codeForDoc/src/**/*.ts'],
	project: ['src/**/*.ts', 'codeForDoc/src/**/*.ts'],
}

export default config
