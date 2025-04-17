import CouchBase from '../index.js'
import {CouchbaseContainer} from "@testcontainers/couchbase";

describe('testcontainers', function () {
    this.timeout(0);
    const username = 'Administrator'
    const password = 'couchbase'
    const domain = 'localhost'
    let controller
    before(async () => {
        const container = new CouchbaseContainer("couchbase/server")
        container.withCredentials(username, password)
        controller = await container.start()
        console.debug(controller.getConnectionString())
    })
    after(async () => {
        await controller.stop()
    })
    it('connect', async () => {
        const bucket = 'travel-sample'
        const scope = "inventory"
        const collection = "airline"

        const cb = new CouchBase({username, password, domain, bucket}, false)


        await cb.connect({scope, collection})
        await cb.disconnect()
    })
})