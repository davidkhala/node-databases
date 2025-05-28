import {MongoDBContainer} from "@testcontainers/mongodb";
import MongoDB from "../mongo.js";
import {Controller} from "@davidkhala/db/vendor/testcontainers.js";

export class MongoDBController extends Controller {
    constructor() {
        super();
        this.container = new MongoDBContainer("mongo:8.0.8");
    }

    get port() {
        return this.handler.getMappedPort(27017)
    }

    async getConnection(name) {
        const mongoConnect = new MongoDB({}, this.connectionString);
        await mongoConnect.connect(name, {directConnection: true});
        return mongoConnect
    }
}
