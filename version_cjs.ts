import pkg from './package.json'
import fs from 'fs'

pkg.version = pkg.version + '-cjs'

fs.writeFileSync('package.json', JSON.stringify(pkg), 'utf8')
