import {Cosmos, CosmosEdge, CosmosVertex} from "../cosmos.js";
import {drop} from "../query.js";
import assert from 'assert'

describe('cosmos', function () {
    this.timeout(0)
    const config = {
        database: 'graphdb',
        graph: 'Persons',
        username: 'tinkerpop',
        password: process.env.COSMOS_GREMLIN_PASSWORD
    }
    const cosmos = new Cosmos(config)
    beforeEach(async () => {
        await cosmos.connect()
    })
    afterEach(async () => {
        await cosmos.disconnect()
    })
    it('(connect)', async () => {
    })
    it('azure-cosmos-db-graph-nodejs-getting-started', async () => {


        await cosmos.query(drop)
        const nodeSource = new CosmosVertex('person', "thomas")
        const nodeTarget = new CosmosVertex('person', 'mary')
        const edgeTemplate = new CosmosEdge('knows')
        await cosmos.query(nodeSource.create({
            firstName: "Thomas",
            age: 44, userid: 1
        }))
        await cosmos.query(nodeTarget.create({
            firstName: "Mary",
            lastName: "Andersen",
            age: 39,
            userid: 2
        }))
        await cosmos.query(edgeTemplate.create(nodeSource, nodeTarget))
        const [count] = await cosmos.query(CosmosVertex.count)
        assert.strictEqual(count, 2)
        const result = await cosmos.query(nodeSource.list())

        assert.ok(result.map(({id})=>id).includes('thomas'))
        console.debug(await cosmos.getV('thomas'))
    })
})