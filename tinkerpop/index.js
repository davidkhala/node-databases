import Gremlin from "gremlin";
import assert from "assert";
import DB from '@davidkhala/db/index.js'

const {traversal} = Gremlin.process.AnonymousTraversalSource;

export class AbstractGremlin extends DB {
    constructor({domain, port, dialect, name}, options, logger) {
        super({domain, port, dialect, name}, undefined, logger)
        this.connection = new Gremlin.driver.Client(this.connectionString, options);
        this.g = traversal().withRemote(this.connection);
    }

    async connect() {
        await this.connection.open()
    }

    async disconnect() {
        await this.connection.close()
    }

    async query(traversal, values = {}) {
        const message = `g.${traversal}`
        this.logger(message)
        return await this.connection.submit(message, values)
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