import {ContainerOptsBuilder, ContainerManager} from "@davidkhala/dockerode/docker.js";

/**
 *
 * @param {ContainerManager} manager
 * @param HostPort
 * @param password POSTGRES_PASSWORD (env)
 * @returns {Promise<function>}
 */
export async function docker(manager, {HostPort, password}) {
    const Image = 'mongo'
    const opts = new ContainerOptsBuilder(Image, [])

    opts.setPortBind(`${HostPort}:27017`)
    opts.setName(Image)
    await manager.containerStart(opts.opts, undefined, true)
    return async () => await manager.containerDelete(Image)
}