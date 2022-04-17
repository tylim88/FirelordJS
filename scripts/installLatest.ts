import pkg from '../package.json'
import shell from 'shelljs'

// https://stackoverflow.com/questions/38032047/how-to-execute-npm-run-command-programmatically
// to make sure it always install the latest exact version because apparently `latest` is not working in package.json with just published package
shell.exec(`npm --prefix codeForDoc i ${pkg.name}@${pkg.version}`)
