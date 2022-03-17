import { deleteApp } from 'firebase/app'
import { initializeApp } from './utilForTests'

module.exports = async () => {
	deleteApp(initializeApp())
	console.log('exit')
	process.exit()
}
