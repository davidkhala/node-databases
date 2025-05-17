import {Project} from "../project.js";
import {Cluster} from "../cluster.js";
import Organization from "../organization.js";


export async function warmup() {
    const secret = process.env.CAPELLA_API_SECRET
    const org = new Organization(secret)
    const organizationId = (await org.list())[0].id
    const project = new Project(secret, organizationId)
    const projectId = (await project.list())[0].id
    const cluster = new Cluster(secret, organizationId, projectId)
    const clusterId = (await cluster.list())[0].id
    const clusterOperator = new Cluster.Operator(secret, organizationId, projectId, clusterId)
    await clusterOperator.ensureStarted()

    return {
        cluster: clusterOperator,
        organization:org,
        organizationId, projectId, clusterId,
        secret
    }
}