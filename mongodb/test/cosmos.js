import Cosmos from '../cosmos.js'

describe('cosmos', function () {
    this.timeout(0)
    const password = process.env.COSMOS_MONGODB_PASSWORD

    const username = 'mongo-davidkhala'
    it('connect', async () => {

        const connect = new Cosmos({username, password})
        await connect.connect()
        await connect.disconnect()
    })

})