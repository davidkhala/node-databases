import Gremlin from "gremlin";
import assert from "assert";

const {traversal} = Gremlin.process.AnonymousTraversalSource;

export class AbstractGremlin {
    constructor(client, logger) {
        Object.assign(this, {client, logger})
        this.g = traversal().withRemote(client);
    }

    async connect() {
        await this.client.open()
    }

    async disconnect() {
        await this.client.close()
    }

    async query(traversal, values = {}) {
        const message = `g.${traversal}`
        this.logger(message)
        return await this.client.submit(message, values)
    }

    /**
     *
     * @param {GraphTraversal} traversal
     * @returns {Promise<Array>}
     */
    static async query(traversal) {
        return await traversal.toList()
    }

    async drop() {
        await AbstractGremlin.query(this.g.V().drop())
    }

    async getV(id) {
        const result = await AbstractGremlin.query(this.g.V(id))
        assert.ok(result.length < 2)
        return result[0]
    }
}