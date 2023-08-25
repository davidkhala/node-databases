import {ContainerOptsBuilder, ContainerManager} from "@davidkhala/dockerode/docker.js";

/**
 *
 * @param {ContainerManager} manager
 * @param HostPort
 */
export async function docker(manager, {HostPort}) {
    const Image = 'tinkerpop/gremlin-server'
    const opts = new ContainerOptsBuilder(Image, [])
    const name = 'gremlin-server'

    opts.setPortBind(`${HostPort}:8182`)
    opts.setName(name)
    await manager.containerStart(opts.opts, undefined, true)
    return async () => manager.containerDelete(name)
}