import Cosmos from '../cosmos.js'

describe('cosmos', function () {
	this.timeout(0)
	const {password} = process.env

	let connect
	it('connectString', async () => {
		const connectString = `mongodb://converged-cosmos:${password}@converged-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@converged-cosmos@`
		connect = new Cosmos({}, connectString)
		await connect.connect()
	})
	it('dbName & token', async () => {
		const dbName = 'converged-cosmos'
		connect = new Cosmos({dbName, token: password})
		await connect.connect()
	})
	after(async () => {
		await connect.disconnect();
	});
})