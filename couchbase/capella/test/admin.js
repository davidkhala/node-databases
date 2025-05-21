import {API_KEY} from "../key.js";
import {calculateId, Name, Sample} from "../bucket.js";
import * as assert from "node:assert";
import {warmup} from "./util.js";
import {Cluster} from '../cluster.js'

describe('cluster', function () {
    this.timeout(0)
    let organizationId, projectId, clusterId, secret
    let clusterOperator, organization
    before(async () => {
        ({organizationId, projectId, clusterId, cluster: clusterOperator, organization, secret} = await warmup())
    })

    it('admin', async () => {
        console.debug(await organization.get(organizationId))
        // cluster
        await clusterOperator.ensureStopped()
        await clusterOperator.ensureStarted()
    })
    it('key', async () => {
        // key
        const key = new API_KEY(secret, organizationId)
        const key_id = (await key.list())[0].id
        console.debug(await key.get(key_id))
    })

})
describe('bucket', function () {
    this.timeout(0)
    let organizationId, projectId, clusterId, secret
    /**
     * @type Sample
     */
    let sample
    before(async () => {
        ({organizationId, projectId, clusterId, secret} = await warmup())
        sample = new Sample(secret, organizationId, projectId, clusterId)
    })

    it('e2e', async () => {

        const addedBuckets = await sample.preset()
        console.debug({addedBuckets})
        await sample.clear()
    })
    it('load and get', async () => {
        await sample.preset()
        console.debug(await sample.get(Name.beer))
    })
    it('index', async ()=>{

        const index = new Cluster.Index(secret, organizationId, projectId, clusterId)
        try {
        //     TODO
        const indexList = await index.list('travel-sample')
        console.debug(indexList)
        }catch (err){
            console.error(err)
        }

    })

})
describe('dependencies', function () {
    this.timeout(0)
    it('base64', async () => {
        assert.equal(calculateId('travel-sample'), 'dHJhdmVsLXNhbXBsZQ==')
    })
})