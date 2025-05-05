import Organization from "../organization.js";
import {API_KEY} from "../key.js";
import {Project} from "../project.js";
import {Cluster} from "../cluster.js";
import {Sample} from "../bucket.js";

const secret = process.env.CAPELLA_API_SECRET
describe('organization', function () {
    this.timeout(0)
    const org = new Organization(secret)
    let organizationId, projectId, clusterId
    before(async () => {
        organizationId = (await org.list())[0].id
        const project = new Project(secret, organizationId)
        projectId = (await project.list())[0].id
        const cluster = new Cluster(secret, organizationId, projectId)
        clusterId = (await cluster.list())[0].id
        const clusterOperator = new Cluster.Operator(cluster, clusterId)
        console.debug(await clusterOperator.get())
        await clusterOperator.ensureStopped()
        await clusterOperator.ensureStarted()
    })

    it('e2e', async () => {
        console.debug(await org.get(organizationId))
        // key
        const key = new API_KEY(secret, organizationId)
        const key_id = (await key.list())[0].id
        console.debug(await key.get(key_id))
        // cluster
        const cluster = new Cluster(secret, organizationId, projectId)
        const clusterOperator = new Cluster.Operator(cluster, clusterId)
        console.debug(await clusterOperator.get())
        await clusterOperator.ensureStopped()
        await clusterOperator.ensureStarted()
    })
    it('bucket', async () => {
        const sample = new Sample(secret, organizationId, projectId, clusterId)
        const addedBuckets = await sample.preset()
        console.debug({addedBuckets})
        await sample.clear()
    })
})