import Gremlin from "gremlin";
import assert from 'assert'
import {AbstractGremlin} from "./index.js";
import {Vertex} from './query.js'

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


        super({domain: `${username}.gremlin.cosmos.azure.com`, port: 443, dialect: 'wss'}, {
            authenticator,
            traversalsource: "g",
            rejectUnauthorized: true,
            mimeType: "application/vnd.gremlin-v2.0+json"
        }, logger)

    }

}


export class CosmosVertex extends Vertex {
    /**
     *
     * @param type The Label of vertex
     * @param id
     * @param [partitionKey]
     */
    constructor(type, id, partitionKey = 'partitionKey') {
        super(type,id);
        this.partitionKey = partitionKey
    }

    create(properties, partitionValue = this.id) {
        return super.create(properties) + `.property('${this.partitionKey}', '${partitionValue}')`;
    }

}
