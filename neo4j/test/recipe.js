import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';

/**
 *
 * @param {OCI} manager
 * @returns {Promise<function>}
 */
export async function docker(manager) {

	const Image = 'neo4j';
	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind('7474:7474'); // HTTP access: for browser
	opts.setPortBind('7687:7687'); // Bolt access: for driver (nodejs, java) connect
	opts.setName(Image);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => await manager.containerDelete(Image);
}