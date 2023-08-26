import {AbstractGremlin} from "./index.js";
import assert from "assert";

export class GremlinServer extends AbstractGremlin {
    constructor({domain = 'localhost', port = 8182} = {}, logger = console.debug) {
        super({domain, port, name: 'gremlin', dialect: 'ws'}, undefined, logger);

    }

    /**
     * @param {GraphTraversal} traversal
     */
    async createV(traversal) {
        const results = await GremlinServer.query(traversal)
        assert.ok(results.length < 2)
        return results[0].id
    }

}

