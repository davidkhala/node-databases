import {ContainerOptsBuilder, ContainerManager} from "@davidkhala/dockerode/docker.js";

/**
 *
 * @param {ContainerManager} manager
 * @param HostPort
 * @param password POSTGRES_PASSWORD (env)
 */
export async function docker(manager, {HostPort, password}) {
    const Image = 'postgres'
    const opts = new ContainerOptsBuilder(Image, [])

    opts.setPortBind(`${HostPort}:5432`)
    opts.setName(Image)
    opts.setEnv([`POSTGRES_PASSWORD=${password}`])
    await manager.containerStart(opts.opts, undefined, true)
    return async () => manager.containerDelete(Image)
}