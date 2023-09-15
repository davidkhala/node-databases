import {ContainerManager} from '@davidkhala/dockerode/docker.js';
import {janusStart} from './recipe.js';
import assert from 'assert';
import {GremlinServerAdmin} from '../gremlin-server.js';
import {JanusGraph} from '../janus-graph.js';

const {queryOne, query} = JanusGraph;
describe('janus-graph', function () {
	this.timeout(0);
	let stop;
	const HostPort = 9182;
	const gremlinServer = new JanusGraph({port: HostPort});
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
		// await stop();
	});
	it('connect', async () => {

	});
	it('transaction', async () => {
		await dba.clear();

		gremlinServer.begin();
		await g.addV('transaction').properties('a', 'b').iterate();
		await g.addV('transaction').properties('a', 'b').iterate();
		await gremlinServer.commit();
		assert.strictEqual(await queryOne(g.V().count()), 2);
		await g.addV('no-tx').iterate();
		assert.strictEqual(await queryOne(g.V().count()), 3);
		console.debug(await query(g.V())); // FIXME properties: undefined
	});
});