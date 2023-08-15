import Gremlin from "gremlin";
import {AbstractGremlin} from "./index.js";

const {DriverRemoteConnection} = Gremlin.driver

export class GremlinServer extends AbstractGremlin {
    constructor({domain = 'localhost', port = 8182}, logger = console.debug) {
        super(new DriverRemoteConnection(`ws://${domain}:${port}/gremlin`), logger);

    }

}

