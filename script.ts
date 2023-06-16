import pkg from './package.json'
import fs from 'fs'

pkg.version = pkg.version + '-cjs'

const content = JSON.stringify(pkg)

fs.writeFileSync('package.json', content, 'utf8')
