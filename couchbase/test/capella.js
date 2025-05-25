import {warmup} from "../capella/test/util.js";
import {Sample} from "@davidkhala/capella/bucket.js";
import CouchBase, {ClusterManager} from "../index.js";
import {admin as username} from "../const.js";
import assert from "node:assert";
import {SearchQuery} from "couchbase";

const bucket = 'travel-sample'
const scope = "inventory"
const collection = "airline"

const password = process.env.CAPELLA_PASSWORD
describe('ddl', function () {
    this.timeout(0)
    let domain, cb, dba
    before(async () => {

        const {organizationId, projectId, clusterId, secret, cluster} = await warmup()
        domain = cluster.domain
        const sample = new Sample(secret, organizationId, projectId, clusterId)
        await sample.preset()
        cb = new CouchBase({domain, tls: true, username, password})
    })

    beforeEach(async () => {
        await cb.connect()
        dba = cb.dba
    })
    afterEach(async () => {
        await cb.disconnect()
    })
    it('connect', async () => {
    })

    it('not implemented functions', async () => {
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
        try {
            await cb.search(`def_primary`, SearchQuery.match('Los'))
        } catch (err) {
            const {context: {http_response_body}} = err
            // err: index not found
            assert.match(http_response_body, /\{"error":"rest_auth: preparePerms, err: index not found",/)
        }

    })
    it('index does exist', async () => {
        const indexName = 'def_city'
        const indexes = await dba.indexList(bucket)
        assert.ok(indexes.some(({name}) => name === indexName))

    })


})
describe('dml', function () {
    this.timeout(0)

    let cb, domain
    /**
     * @type ClusterManager
     */
    let dba
    before(async () => {
        const {cluster} = await warmup()
        domain = cluster.domain
        cb = new CouchBase({domain, tls: true, username, password})
    })
    beforeEach(async () => {
        await cb.connect({bucket, scope})
        dba = cb.dba
    })
    afterEach(async () => {
        await cb.disconnect()
    })
    it('upsert', async () => {

        const coll = cb.bucket.defaultCollection();
        const key = 'a'
        await coll.upsert(key, {"type": 'test'})
        await coll.remove(key)

    })
    it('query', async () => {


        const {rows} = await cb.query(`SELECT *
                                       FROM ${collection}`)
        console.debug(rows)
        await assert.rejects(cb.query(`SELECT *
                                       FROM \`${bucket}\`.${scope}.$collection`, {collection})
            , /parsing failure/)


    })
    it('query with template', async () => {

        const airline = 'TXW'
        const {rows} = await cb.query(`SELECT *
                                       FROM \`${bucket}\`.${scope}.${collection}
                                       WHERE callsign = $airline`, {airline})
        assert.equal(rows[0].country, 'United States')

    })
    it('index', async () => {
        // TODO def_city


    })
})
