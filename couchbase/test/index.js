import CouchBase from '../index.js'
import {CouchbaseController} from "../test-utils/testcontainers.js";

describe('testcontainers', function () {
    this.timeout(0);
    const username = 'Administrator'
    const password = 'couchbase'
    const domain = 'localhost'
    const bucket = 'travel-sample'

    let controller, port
    before(async () => {
        controller = new CouchbaseController()
        controller.container.withCredentials(username, password)
        await controller.start()
        port = controller.port
    })
    after(async () => {
        await controller.stop()
    })
    it('connect', async () => {
        // const scope = "inventory"
        // const collection = "airline"

        const cb = new CouchBase({domain, port, tls: false, username, password})
        console.debug(cb.connectionString)
        await cb.connect()
        const dba = cb.dba
        console.debug("before bucketCreate")
        await dba.bucketCreate(bucket)
        console.debug("after bucketCreate")
        await dba.bucketDelete(bucket)
        console.debug("after bucketDelete")
        await cb.disconnect()
    })
})
describe('capella', function () {
    this.timeout(0)

})