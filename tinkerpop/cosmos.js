import Gremlin from "gremlin";


export class Cosmos {
    constructor({database, graph, endpoint, password}) {
        const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
            `/dbs/${database}/colls/${graph}`,
            password,
        )
        this.client = new Gremlin.driver.Client(
            endpoint,
            {
                authenticator,
                traversalsource: "g",
                rejectUnauthorized: true,
                mimeType: "application/vnd.gremlin-v2.0+json"
            }
        );
    }

    async connect() {
        await this.client.open()
    }

    async disconnect() {
        await this.client.close()
    }
}



