import Cosmos from '../cosmos.js'

describe('cosmos', function () {
    this.timeout(0)
    const {cosmos_password: password} = process.env

    const dbName = 'mongo-davidkhala'
    it('dbName & token', async () => {

        const connect = new Cosmos({dbName, token: password})
        await connect.connect()
        await connect.disconnect()
    })

})