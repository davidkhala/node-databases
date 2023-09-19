import assert from 'assert';
import {OCIContainerOptsBuilder, OCI} from '@davidkhala/dockerode/oci.js';
import {DefaultDatabase, Neo4jTx} from '../index.js';
import {Node} from '../cypher/node.js';
import {SingleRelationship} from '../cypher/relationship.js';

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
	await manager.containerDelete(containerName);
	await manager.containerStart(opts.opts, undefined, true);
	return async () => await manager.containerDelete(containerName);
}

export function initPasswordCmd(newPassword) {
	return `docker exec ${containerName} cypher-shell -u neo4j -p neo4j -d ${DefaultDatabase.system} "ALTER CURRENT USER SET PASSWORD FROM 'neo4j' TO '${newPassword}'"`;

}

/**
 *
 * @param {Neo4j} neo4j
 */
export async function querySet(neo4j) {
	const dba = neo4j.dba;
	const nodeTypes = ['Person'];
	const from = new Node('d', nodeTypes, {name: 'David'});
	const to = new Node('t', nodeTypes, {name: 'Chloe'});
	const rel = new SingleRelationship('m', 'love');
	await dba.clear();

	await neo4j.query(...from.create());
	await neo4j.query(...to.create());
	await neo4j.query(...rel.create(from, to));
	const result = await neo4j.query(...Node.list());

	assert.strictEqual(result.length, 2);
	assert.ok(result.find(({properties}) => properties.name === 'David'));
}

/**
 *
 * @param {Neo4j} neo4j
 * @return {Promise<void>}
 */
export async function transactionWrap(neo4j) {
	const dba = neo4j.dba;
	const tx = new Neo4jTx(neo4j);
	const nodeTypes = ['Person'];
	const from = new Node('d', nodeTypes, {name: 'David'});
	const to = new Node('t', nodeTypes, {name: 'Chloe'});
	const rel = new SingleRelationship('m', 'love');
	await dba.clear();

	await tx.begin();
	await tx.run(...from.create());
	await tx.run(...to.create());
	await tx.run(...rel.create(from, to));
	await tx.submit();
	const nodeList = await neo4j.query(...Node.list());
	assert.strictEqual(nodeList.length, 2);
	return nodeList;

}
