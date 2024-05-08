import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

export async function docker(manager, {HostPort = 1433, password}) {
	const Image = 'mcr.microsoft.com/mssql/server:2022-latest';
	const name = 'mssql';

	const opts = new OCIContainerOptsBuilder(Image);
	opts.setPortBind(`${HostPort}:1433`);
	opts.setHealthCheck({
		useShell: true, commands: [Test]
	});

	opts.name = name;
	opts.env = ['ACCEPT_EULA=Y', `MSSQL_SA_PASSWORD=${password}`];
	await manager.containerStart(opts.opts, true);
	await manager.containerWaitForHealthy(name);
	return async () => manager.containerDelete(name);
}