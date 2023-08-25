import {OCIContainerOptsBuilder, OCI} from "@davidkhala/dockerode/oci.js";

/**
 *
 * @param {OCI} manager
 * @param HostPort
 */
export async function start(manager, {HostPort}) {
    const Image = 'tinkerpop/gremlin-server'
    const opts = new OCIContainerOptsBuilder(Image, [])
    const name = 'gremlin-server'

    opts.setPortBind(`${HostPort}:8182`)
    opts.setName(name)
    await manager.containerStart(opts.opts, undefined, true)
    return async () => manager.containerDelete(name)
}