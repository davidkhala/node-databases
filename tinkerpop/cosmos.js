import Gremlin from "gremlin";
import assert from 'assert'
import {AbstractGremlin} from "./index.js";

export class Cosmos extends AbstractGremlin {
    /**
     *
     * @param database
     * @param graph
     * @param username Azure Cosmos DB Account(帐户)
     * @param password PRIMARY KEY | SECONDARY KEY
     * @param [logger]
     */
    constructor({database, graph, username, password}, logger = console.debug) {
        assert.ok(password, 'Missing PRIMARY KEY / SECONDARY KEY')
        const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
            `/dbs/${database}/colls/${graph}`,
            password,
        )
        const endpoint = `wss://${username}.gremlin.cosmos.azure.com:443/`
        const client = new Gremlin.driver.Client(
            endpoint,
            {
                authenticator,
                traversalsource: "g",
                rejectUnauthorized: true,
                mimeType: "application/vnd.gremlin-v2.0+json"
            }
        );
        super(client, logger)

    }

}




