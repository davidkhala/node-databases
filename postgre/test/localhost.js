import {ContainerManager, ContainerOptsBuilder} from '@davidkhala/dockerode/podman.js'

describe('docker postgre', function () {
    const manager = new ContainerManager()
    this.timeout(0)
    it('container start', async () => {
        const Image = 'postgres'
        await manager.imagePull(Image)
        const opts = new ContainerOptsBuilder(Image, ['postgres'])

        opts.setPortBind('5432')
        opts.setName(Image)
        opts.setEnv(['POSTGRES_PASSWORD=mysecretpassword'])
        await manager.containerStart(opts.opts, undefined, true)
    })

})