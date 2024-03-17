import {OCI} from '@davidkhala/container/oci.js';
import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

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
	const name = Image;
	opts.setPortBind(`${HostPort}:5432`);

	opts.setHealthCheck({useShell: true, interval: 1000, commands: [Test]});

	opts.name = name;
	opts.env = [`POSTGRES_PASSWORD=${password}`];
	await manager.containerStart(opts.opts, true);
	await manager.containerWaitForHealthy(name);
	return async () => manager.containerDelete(Image);
}