import Organization from "../organization.js";
import {API_KEY} from "../key.js";
import {Project} from "../project.js";
import {Cluster} from "../cluster.js";
import {Sample, Name} from "../bucket.js";
import {base64} from "@davidkhala/light/format.js";
import * as assert from "node:assert";

const secret = process.env.CAPELLA_API_SECRET

const org = new Organization(secret)
describe('cluster', function () {
    this.timeout(0)
    let organizationId, projectId, clusterId
    let clusterOperator
    before(async () => {
        organizationId = (await org.list())[0].id
        const project = new Project(secret, organizationId)
        projectId = (await project.list())[0].id
        const cluster = new Cluster(secret, organizationId, projectId)
        clusterId = (await cluster.list())[0].id
        clusterOperator = new Cluster.Operator(secret, organizationId, projectId, clusterId)
        console.debug(await clusterOperator.get())
    })

    it('e2e', async () => {
        console.debug(await org.get(organizationId))
        // key
        const key = new API_KEY(secret, organizationId)
        const key_id = (await key.list())[0].id
        console.debug(await key.get(key_id))
        // cluster
        await clusterOperator.ensureStopped()
        await clusterOperator.ensureStarted()
    })
    it('', () => {
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
        organizationId = (await org.list())[0].id
        const project = new Project(secret, organizationId)
        projectId = (await project.list())[0].id
        const cluster = new Cluster(secret, organizationId, projectId)
        clusterId = (await cluster.list())[0].id
        const clusterOperator = new Cluster.Operator(secret, organizationId, projectId, clusterId)
        await clusterOperator.ensureStarted()
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
        assert.equal(base64.encode('travel-sample'), 'dHJhdmVsLXNhbXBsZQ==')
    })
})