import {ContainerManager, ContainerOptsBuilder} from '@davidkhala/dockerode/docker.js'
import PostGRE from "../index.js";
import {docker} from '../recipe.js'

describe('docker postgre', function () {
    const manager = new ContainerManager()
    this.timeout(0)
    const password = 'mysecretpassword'
    it('container start', async () => {
        await docker(manager, {HostPort: 6432, password})
    })
    it('connect', async () => {
        const postgre = new PostGRE({domain: 'localhost', port: 6432, password})
        await postgre.connect()
        await postgre.disconnect()
    })

})