import CouchBase, {ClusterManager} from '../index.js'
import {CouchbaseController} from "../test-utils/testcontainers.js";
import * as assert from "node:assert";

const bucket = 'travel-sample'
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
import Organization from '@davidkhala/capella/organization.js'
import {Project} from '@davidkhala/capella/project.js'
import {Cluster, Operator as ClusterOperator} from '@davidkhala/capella/cluster.js'

const secret = process.env.CAPELLA_API_SECRET
describe('capella', function () {
    this.timeout(0)


    let org_id, project_id, cluster_id, domain, cluster
    before(async () => {
        const org = new Organization(secret)
        org_id = (await org.list())[0].id
        const project = new Project(secret, org_id)
        project_id = (await project.list())[0].id
        cluster = new Cluster(secret, org_id, project_id)
        cluster_id = (await cluster.list())[0].id
        const operator = new ClusterOperator(cluster, cluster_id)
        await operator.ensureStarted()
        domain = operator.domain

    })
    const scope = "inventory"
    const collection = "airline"

    const password = process.env.CAPELLA_PASSWORD
    const cb = new CouchBase({domain, tls: true, username, password})
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
})