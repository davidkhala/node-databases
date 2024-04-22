import {ContainerManager} from '@davidkhala/docker/docker.js';
import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';

/**
 *
 * @param {ContainerManager} manager
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

	await manager.containerStart(opts.opts, true);

	const isNotError = (e) => {
		return e.code === 0 && e.stderr === 'mysql: [Warning] Using a password on the command line interface can be insecure.\n';
	};

	const Cmd = ['mysql', '-uroot', `-p${password}`, '-e', 'select 1'];
	let finality = 0;
	while (finality < 2) {
		try {
			await manager.containerExec(name, {Cmd});
		} catch (e) {
			if (isNotError(e)) {
				finality++;
			}
		}
	}

	const command = `ALTER USER 'root'@'%' IDENTIFIED BY '${password}';`;
	try {
		await manager.containerExec(name, {Cmd: ['mysql', '-uroot', `-p${password}`, '-e', command]});
	} catch (e) {
		if (!isNotError(e)) {
			throw e;
		}
	}


	return async () => manager.containerDelete(name);
}