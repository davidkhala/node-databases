import {GremlinServer} from "../gremlin-server.js";
import assert from "assert";

const {query} = GremlinServer

describe('gremlin-server', () => {
    const gremlinServer = new GremlinServer()

    after(async () => {
        await gremlinServer.disconnect()
        assert.ok(!gremlinServer.connection.isOpen)
    })
    it('(connect)', async () => {
        await gremlinServer.connect()
        assert.ok(gremlinServer.connection.isOpen)
        await gremlinServer.disconnect()
        assert.ok(!gremlinServer.connection.isOpen)
    })
    it('sample', async () => {
        await gremlinServer.connect()
        const {g} = gremlinServer
        await gremlinServer.drop()

        console.debug(await query(g.E().count()))
        const [v1] = await query(g.addV("person").property("name", "Alice").property("age", 30))
        const [v2] = await query(g.addV("person").property("name", "Bob").property("age", 35))
        console.debug('get by id', await gremlinServer.getV(v1.id))

        console.debug(await query(g.V().hasLabel("person").values()))

        await query(g.V(v1).addE("knows").to(v2))
        console.debug(await query(g.E().count()))

    })
})