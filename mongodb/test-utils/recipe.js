import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {OCI} from '@davidkhala/container/oci.js';
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
	opts.name = Image;
	await manager.containerStart(opts.opts, true);
	return async () => await manager.containerDelete(Image);
}
