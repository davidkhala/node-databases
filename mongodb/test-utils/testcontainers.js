import {MongoDBContainer} from "@testcontainers/mongodb";

export class MongoDBController  {
    constructor() {
        this.container = new MongoDBContainer("mongo:8.0.8");
    }
    async start() {
        this.handler = await this.container.start();
    }
    get port() {
        return this.handler.getMappedPort(27017)
    }
    get connectionString() {
        return this.handler.getConnectionString()
    }
    async stop(){
        return await this.handler.stop()
    }
}
