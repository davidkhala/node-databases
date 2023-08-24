import {AbstractGremlin} from "./index.js";

export class GremlinServer extends AbstractGremlin {
    constructor({domain = 'localhost', port = 8182}, logger = console.debug) {
        super({domain, port, name: 'gremlin', dialect: 'ws'}, undefined, logger);

    }

}

