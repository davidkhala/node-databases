import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';

/**
 *
 * @param {OCI} manager
 * @param webPort
 * @param boltPort
 * @returns {Promise<function>}
 */
export async function docker(manager, webPort = 7474, boltPort = 7687) {

	const Image = 'neo4j';
	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind(`${webPort}:7474`); // HTTP access: for browser
	opts.setPortBind(`${boltPort}:7687`); // Bolt access: for driver (nodejs, java) connect
	opts.setName(Image);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => await manager.containerDelete(Image);
}