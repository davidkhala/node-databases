import {GremlinServer} from "../gremlin-server.js";
import assert from "assert";

const {query} = GremlinServer

describe('gremlin-server', () => {
    const gremlinServer = new GremlinServer({})
    beforeEach(async () => {
        await gremlinServer.connect()
        assert.ok(gremlinServer.client.isOpen)
    })
    afterEach(async () => {
        await gremlinServer.disconnect()
        assert.ok(!gremlinServer.client.isOpen)
    })
    it('', async () => {
    })
    it('sample', async () => {
        const {g} = gremlinServer
        await gremlinServer.drop()

        const [v1] = await query(g.addV("person").property("name", "Alice").property("age", 30))
        const [v2] = await query(g.addV("person").property("name", "Bob").property("age", 35))
        console.debug('get by id', await gremlinServer.getV(v1.id))

        console.debug(await query(g.V().hasLabel("person").valueMap()))

        await query(g.V(v1).addE("knows").to(v2))
        console.debug(await query(g.E().count()))

    })
})