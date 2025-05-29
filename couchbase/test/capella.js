import {warmup} from "../capella/test/util.js";
import {Sample} from "@davidkhala/capella/bucket.js";
import CouchBase, {ClusterManager} from "../index.js";
import {admin as username} from "../const.js";
import assert from "node:assert";
import {Search} from '../scope.js'
import {SearchQuery} from "couchbase";

const bucket = 'travel-sample'


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
    })
    it('list index in bucket', async () => {
        const indexName = 'def_inventory_airline_primary'
        const indexes = await dba.queryIndexes(bucket)
        assert.ok(indexes.some(({name}) => name === indexName))
    })
    it('list search index in scope', async () => {

        await cb.disconnect()
        await cb.connect({bucket, scope: '_default'})
        dba = cb.dba

        const indexes = await dba.searchIndexes()
        assert.ok(indexes.some(({name}) => name === 'travel_default'))

    })


})
describe('dml', function () {
    this.timeout(0)
    const scope = "inventory"
    const collection = "airline"
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
    it('search city', async () => {
        const indexName = 'travel-inventory-airline'
        const search = new Search(cb.scope)
        const r = await search.query(indexName, SearchQuery.match('UK'))
        console.debug(r)
    })
})
