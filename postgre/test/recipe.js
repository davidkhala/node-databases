import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';

/**
 *
 * @param {OCI} manager
 * @param HostPort
 * @param password POSTGRES_PASSWORD (env)
 */
export async function docker(manager, {HostPort, password}) {
	const Image = 'postgres';
	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind(`${HostPort}:5432`);
	opts.setName(Image);
	opts.setEnv([`POSTGRES_PASSWORD=${password}`]);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => manager.containerDelete(Image);
}