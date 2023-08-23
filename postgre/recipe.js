import {ContainerOptsBuilder, ContainerManager} from "@davidkhala/dockerode/docker.js";

/**
 *
 * @param {ContainerManager} manager
 * @param HostPort
 * @param password POSTGRES_PASSWORD (env)
 * @returns {Promise<void>}
 */
export async function docker(manager, {HostPort, password}) {
    const Image = 'postgres'
    await manager.imagePull(Image)
    const opts = new ContainerOptsBuilder(Image, ['postgres'])

    opts.setPortBind(`${HostPort}:5432`)
    opts.setName(Image)
    opts.setEnv([`POSTGRES_PASSWORD=${password}`])
    await manager.containerStart(opts.opts, undefined, true)
}