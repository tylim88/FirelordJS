import pkg from './package.json'
import fs from 'fs'
import shell from 'shelljs'

const oriPkg = structuredClone(pkg)

pkg.version = pkg.version + '-cjs'

fs.writeFileSync('package.json', JSON.stringify(pkg), 'utf8')

shell.exec(`rm -rf dist && tsc -p tsconfig.prod.cjs.json`)

fs.writeFileSync('package.json', JSON.stringify(oriPkg), 'utf8')

shell.exec(`prettier --write package.json`)
