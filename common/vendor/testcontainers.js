// import {StartedTestContainer, GenericContainer} from "testcontainers"
import {Controller as C} from '@davidkhala/light/vendor/testcontainers.js'

/**
 * @abstract
 */
export class Controller extends C {

    get connectionString() {
        return this.handler.getConnectionString()
    }

    /**
     * @abstract
     */
    async getConnection() {
    }
}