import assert from 'assert';
import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';
import {DefaultDatabase} from '../index.js';

const Image = 'neo4j';
const containerName = Image;

/**
 *
 * @param {OCI} manager
 * @param [password]
 * @param [webPort]
 * @param [boltPort]
 * @returns {Promise<function>}
 */
export async function docker(manager, {
	password,
	webPort = 7474, boltPort = 7687
} = {}) {


	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind(`${webPort}:7474`); // HTTP access: for browser
	opts.setPortBind(`${boltPort}:7687`); // Bolt access: for driver (nodejs, java) connect
	opts.setName(containerName);
	if (password) {
		assert.notEqual(password, 'neo4j', 'Invalid value for password. It cannot be \'neo4j\', which is the default.');
		opts.setEnv([`NEO4J_AUTH=neo4j/${password}`]);
	} else if (password === null) {
		opts.setEnv(['NEO4J_AUTH=none']);
	}

	await manager.containerStart(opts.opts, undefined, true);
	return async () => await manager.containerDelete(Image);
}

export function initPasswordCmd(newPassword) {
	return `docker exec ${containerName} cypher-shell -u neo4j -p neo4j -d ${DefaultDatabase.system} "ALTER CURRENT USER SET PASSWORD FROM 'neo4j' TO '${newPassword}'"`;

}
