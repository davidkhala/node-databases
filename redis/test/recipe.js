import {OCI} from '@davidkhala/container/oci.js';
import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

/**
 * // docker run -p 6379:6379 -it redis/redis-stack-server:latest
 * @param {OCI} manager
 * @param {string|number} HostPort
 * @param {string} password
 */
export async function stackServer(manager, {HostPort = 6379} = {}) {
	const Image = 'redis/redis-stack-server';
	const opts = new OCIContainerOptsBuilder(Image);

	const name = 'redis';
	opts.setPortBind(`${HostPort}:6379`);

	opts.name = name;
	opts.setHealthCheck({
		useShell: true, commands: [Test]
	});
	await manager.containerStart(opts.opts, true);
	await manager.containerWaitForHealthy(name);
	return async () => manager.containerDelete(name);
}

export async function dragonFly(manager, {HostPort = 6379} = {}) {
	const Image = 'docker.dragonflydb.io/dragonflydb/dragonfly';
	const opts = new OCIContainerOptsBuilder(Image);
	const name = 'dragonfly';
	opts.name = name;
	// opts.opts.HostConfig.NetworkMode = 'host';
	opts.setPortBind(`${HostPort}:6379`);
	opts.opts.HostConfig.Ulimits = [{'Name': 'memlock', 'Hard': -1, 'Soft': -1}];
	opts.setHealthCheck({
		useShell: true, commands: [Test]
	});
	await manager.containerStart(opts.opts, true);
	await manager.containerWaitForHealthy(name);
	return async () => manager.containerDelete(name);
}