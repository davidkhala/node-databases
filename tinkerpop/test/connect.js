import {Cosmos} from "../cosmos.js";

describe('cosmos', () => {

    it('sample app: Gremlin Console', async () => {
        const config = {
            database: 'graphdb',
            graph: 'Persons',
            endpoint: 'wss://tinkerpop.gremlin.cosmos.azure.com:443/',
            password: process.env.password
        }
        const object = new Cosmos(config)
        await object.connect()
        await object.disconnect()
    })

})