import {Cosmos} from "../cosmos.js";
import {drop, Edge, Vertex} from "../traversal.js";
import assert from 'assert'

describe('cosmos', () => {

    const config = {
        database: 'graphdb',
        graph: 'Persons',
        username: 'tinkerpop',
        password: process.env.password
    }
    const cosmos = new Cosmos(config)
    it('connect', async () => {
        await cosmos.connect()
        await cosmos.disconnect()
    })
    it('azure-cosmos-db-graph-nodejs-getting-started', async () => {
        await cosmos.connect()
        await cosmos.query(drop)
        const source = "thomas"
        const target = 'mary'
        const nodeTemplate = new Vertex('person')
        const edgeTemplate = new Edge('knows')
        await cosmos.query(nodeTemplate.add(source, {
            firstName: "Thomas",
            age: 44, userid: 1
        }))
        await cosmos.query(nodeTemplate.add(target, {
            firstName: "Mary",
            lastName: "Andersen",
            age: 39,
            userid: 2
        }))
        await cosmos.query(edgeTemplate.add(source, target))
        const [count] = await cosmos.query(Vertex.count)
        assert.strictEqual(count, 2)

        await cosmos.disconnect()
    })
    it('sample app: Gremlin Console')
})