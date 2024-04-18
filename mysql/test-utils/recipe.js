import {OCI} from '@davidkhala/container/oci.js';
import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

/**
 *
 * @param {OCI} manager
 * @param {string|number} HostPort
 * @param {string} password
 */
export async function docker(manager, {HostPort, password}) {
	const Image = 'mysql';
	const opts = new OCIContainerOptsBuilder(Image);

	const name = Image;
	opts.setPortBind(`${HostPort}:3306`);

	opts.name = name;
	opts.env = [`MYSQL_ROOT_PASSWORD=${password}`];
	opts.setHealthCheck({
		useShell: true, commands: [Test]
	});
	await manager.containerStart(opts.opts, true);
	await manager.containerWaitForHealthy(name);
    // TODO docker exec
	return async () => manager.containerDelete(name);
}