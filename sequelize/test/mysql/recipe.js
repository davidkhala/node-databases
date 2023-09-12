import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';

/**
 *
 * @param {OCI} manager
 * @param {string|number} HostPort
 * @param {string} password
 */
export async function docker(manager, {HostPort, password}) {
	const Image = 'mysql';
	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind(`${HostPort}:3306`);
	opts.setName(Image);
	opts.setEnv([`MYSQL_ROOT_PASSWORD=${password}`]);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => manager.containerDelete(Image);
}