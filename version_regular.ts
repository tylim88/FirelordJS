import pkg from './package.json'
import fs from 'fs'

pkg.version = pkg.version.split('-cjs')[0]!

fs.writeFileSync('package.json', JSON.stringify(pkg), 'utf8')
