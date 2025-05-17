import CouchBase, {ClusterManager} from '../index.js'
import {CouchbaseController} from "../test-utils/testcontainers.js";
import * as assert from "node:assert";
import {Sample} from '@davidkhala/capella/bucket.js'
import {warmup} from "../capella/test/util.js";

const bucket = 'travel-sample'
const scope = "inventory"
const collection = "airline"
const username = 'Administrator'
describe('testcontainers', function () {
    this.timeout(0);

    const password = 'couchbase'
    const domain = 'localhost'


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
    const cb = new CouchBase({domain, port, tls: false, username, password})
    it('bucket manage', async () => {

        await cb.connect()
        const dba = new ClusterManager(cb)
        const newBucket = 'new'
        const r = await dba.bucketCreate(newBucket)
        console.info('bucketCreate', r)
        await dba.clear()
        assert.equal((await dba.bucketList()).length, 0)
        await cb.disconnect()
    })
})


const password = process.env.CAPELLA_PASSWORD
describe('capella', function () {
    this.timeout(0)
    let organizationId, projectId, clusterId, domain, cluster, cb
    before(async () => {
        let secret
        ({organizationId, projectId, clusterId, secret, cluster} = await warmup())
        domain = cluster.domain
        const sample = new Sample(secret, organizationId, projectId, clusterId)
        await sample.preset()
        cb = new CouchBase({domain, tls: true, username, password})
    })


    it('connect', async () => {
        await cb.connect()
        await cb.disconnect()
    })

    it('not implemented functions', async () => {
        await cb.connect()

        const dba = new ClusterManager(cb)
        const buckets = await dba.bucketList(true)
        assert.ok(buckets.includes(bucket))
        try {
            await dba.grant(username, 'cluster.buckets!create')
        } catch (err) {
            const {context: {response_body}} = err
            assert.equal(response_body, '{"message":"Forbidden. User needs the following permissions","permissions":["cluster.admin.security!write"]}')
        }

        const newBucket = 'new'
        try {
            await dba.bucketCreate(newBucket)
        } catch (err) {
            const {context: {response_body}} = err
            assert.equal(response_body, '{"message":"Forbidden. User needs the following permissions","permissions":["cluster.buckets!create"]}')
        }

        await cb.disconnect()
    })
    it('upsert', async () => {
        await cb.connect({bucket})
        const coll = cb.bucket.defaultCollection();
        const key = 'a'
        await coll.upsert(key, {"type": 'test'})
        await coll.remove(key)
        await cb.disconnect()
    })
    it('query', async () => {
        await cb.connect({bucket, scope})

        const r1 = await cb.query(`SELECT *
                                   FROM ${collection}`)
        console.debug(r1)
        await assert.rejects(cb.query(`SELECT *
                                       FROM \`${bucket}\`.${scope}.$collection`, {collection})
            , /parsing failure/)

        await cb.disconnect()
    })
    it('query with template', async () => {
        await cb.connect()
        const airline = 'TXW'
        const {rows} = await cb.query(`SELECT *
                                     FROM \`${bucket}\`.${scope}.${collection}
                                     WHERE callsign = $airline`, {airline})
        assert.equal(rows[0].country, 'United States')
        await cb.disconnect()
    })

})