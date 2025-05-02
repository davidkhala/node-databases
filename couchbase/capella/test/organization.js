import Organization from "../organization.js";
import {API_KEY} from "../key.js";
import {Project} from "../project.js";
import {Cluster} from "../cluster.js";

const secret = process.env.CAPELLA_API_SECRET
describe('organization', function () {
    this.timeout(0)
    const org = new Organization(secret)

    it('get', async () => {
        const org_id = (await org.list())[0].id
        console.debug(await org.get(org_id))
        // key
        const key = new API_KEY(secret, org_id)
        const key_id = (await key.list())[0].id
        console.debug(await key.get(key_id))
        // project
        const project = new Project(secret, org_id)
        const project_id = (await project.list())[0].id
        // cluster
        const cluster = new Cluster(secret, org_id, project_id)
        const clusterId = (await cluster.list())[0].id
        console.debug(await cluster.get(clusterId))
        await cluster.ensureStopped(clusterId)
        await cluster.ensureStarted(clusterId)

    })
})