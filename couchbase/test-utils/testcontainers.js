import {CouchbaseContainer} from "@testcontainers/couchbase";
import {Controller} from "@davidkhala/db/vendor/testcontainers.js";

export class CouchbaseController extends Controller {
    constructor() {
        super();
        this.container = new CouchbaseContainer("couchbase/server");
    }

    get port() {
        return this.handler.getMappedPort(11210)
    }

}
