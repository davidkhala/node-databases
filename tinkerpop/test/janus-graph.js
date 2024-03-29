import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {janusStart} from './recipe.js';
import assert from 'assert';
import {GremlinServer, GremlinServerAdmin} from '../gremlin-server.js';
import {JanusGraph, JanusGraphTx} from '../janus-graph.js';

const {queryOne, query} = JanusGraph;
describe('janus-graph', function () {
	this.timeout(0);
	let stop;
	const HostPort = 9182;
	const gremlinServer = new GremlinServer({port: HostPort});
	const {g} = gremlinServer;
	const dba = new GremlinServerAdmin(gremlinServer);
	before(async () => {
		const manager = new ContainerManager();
		stop = await janusStart(manager, {HostPort});
		await gremlinServer.connect(-1);

		assert.ok(gremlinServer.connection.isOpen);
	});
	after(async () => {
		await gremlinServer.disconnect();
		assert.ok(!gremlinServer.connection.isOpen);
		await stop();
	});
	it('connect', async () => {

	});
	it('transaction', async () => {
		await dba.clear();
		const tx = new JanusGraphTx(gremlinServer);
		tx.begin();
		await g.addV('transaction').property('a', 'b').iterate();
		await g.addV('transaction').properties('a', 'b').iterate();
		await tx.commit();
		assert.strictEqual(await queryOne(g.V().count()), 2);
		await g.addV('no-tx').propertyMap('a', 'c').iterate();
		assert.strictEqual(await queryOne(g.V().count()), 3);
		console.debug(await query(g.V())); // FIXME unknown bug: properties: undefined
	});
});