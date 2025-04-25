import {StartedTestContainer, GenericContainer} from "testcontainers"

export class Controller {

    constructor() {
        /**
         @type GenericContainer
         */
        this.container = undefined //  ;
    }

    async start() {
        /**
         * @type {StartedTestContainer}
         */
        this.handler = await this.container.start();
    }

    get port() {
    }

    get connectionString() {
        return this.handler.getConnectionString()
    }

    async stop() {
        return await this.handler.stop()
    }

    async getConnection() {
    }
}