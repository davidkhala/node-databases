import {API_KEY} from "../key.js";
import {calculateId, Name, Sample} from "../bucket.js";
import * as assert from "node:assert";
import {warmup} from "./util.js";

describe('cluster', function () {
    this.timeout(0)
    let organizationId, projectId, clusterId
    let clusterOperator, organization
    before(async () => {
        ({organizationId, projectId, clusterId, cluster:clusterOperator, organization} = await warmup())
    })

    it('e2e', async () => {
        console.debug(await organization.get(organizationId))
        // key
        const key = new API_KEY(organization.api.secret, organizationId)
        const key_id = (await key.list())[0].id
        console.debug(await key.get(key_id))
        // cluster
        await clusterOperator.ensureStopped()
        await clusterOperator.ensureStarted()
    })

})
describe('bucket', function () {
    this.timeout(0)
    let organizationId, projectId, clusterId
    /**
     * @type Sample
     */
    let sample
    before(async () => {
        let secret
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

})
describe('dependencies', function () {
    this.timeout(0)
    it('base64', async () => {
        assert.equal(calculateId('travel-sample'), 'dHJhdmVsLXNhbXBsZQ==')
    })
})