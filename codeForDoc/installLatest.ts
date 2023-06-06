import pkg from '../package.json'
import shell from 'shelljs'

// https://stackoverflow.com/questions/38032047/how-to-execute-npm-run-command-programmatically
// specify the version because npm i firelord@latest may not install the newly published package
shell.exec(`npm i ${pkg.name}@${pkg.version}`)
