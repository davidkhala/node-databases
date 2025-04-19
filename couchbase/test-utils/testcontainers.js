import {CouchbaseContainer} from "@testcontainers/couchbase";
import {TestcontainersController} from "@davidkhala/db/vendor/testcontainers.js";

export class CouchbaseController extends TestcontainersController {
    constructor() {
        super();
        this.container = new CouchbaseContainer("couchbase/server");
    }

    get port() {
        return this.handler.getMappedPort(11210)
    }

    async getConnection() {

    }
}
