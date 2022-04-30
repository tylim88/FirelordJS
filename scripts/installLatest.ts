import pkg from '../package.json'
import shell from 'shelljs'

// https://stackoverflow.com/questions/38032047/how-to-execute-npm-run-command-programmatically
// this code is for newly published code testing because @latest apparently not alway able to target newly published package
shell.exec(`npm --prefix codeForDoc i ${pkg.name}@${pkg.version}`)
