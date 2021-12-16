import Cosmos from '../cosmos.js'

describe('cosmos', function () {
	this.timeout(0)
	const {cosmos_password: password} = process.env

	it('connectString', async () => {
		const connectString = `mongodb://converged-cosmos:${password}@converged-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@converged-cosmos@`
		const connect = new Cosmos({}, connectString)
		await connect.connect()
		await connect.disconnect()
	})
	it('dbName & token', async () => {
		const dbName = 'converged-cosmos'
		const connect = new Cosmos({dbName, token: password})
		await connect.connect()
		await connect.disconnect()
	})

})