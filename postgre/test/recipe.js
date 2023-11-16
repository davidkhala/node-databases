import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';

/**
 *
 * @param {OCI} manager
 * @param HostPort
 * @param password POSTGRES_PASSWORD (env)
 * @param {Object} postgres_envs
 */
export async function docker(manager, {HostPort, password, postgres_envs = {}}) {
	const Image = 'postgres';
	const cmd = ['postgres'];
	for (const [key, value] of Object.entries(postgres_envs)) {
		cmd.push(`--${key}=${value}`);
	}
	const opts = new OCIContainerOptsBuilder(Image, cmd);

	opts.setPortBind(`${HostPort}:5432`);
	opts.setName(Image);
	opts.setEnv([`POSTGRES_PASSWORD=${password}`]);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => manager.containerDelete(Image);
}