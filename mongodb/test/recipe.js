import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';

/**
 *
 * @param {OCI} manager
 * @param HostPort
 * @returns {Promise<function>}
 */
export async function docker(manager, {HostPort}) {
	const Image = 'mongo';
	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind(`${HostPort}:27017`);
	opts.setName(Image);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => await manager.containerDelete(Image);
}