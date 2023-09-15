import {GremlinServer, GremlinServerAdmin} from '../gremlin-server.js';
import assert from 'assert';
import {serverStart} from './recipe.js';
import {ContainerManager} from '@davidkhala/dockerode/docker.js';

const {query} = GremlinServer;

describe('gremlin-server', function () {
	this.timeout(0);
	const HostPort = 8182;
	const gremlinServer = new GremlinServer({port: HostPort});
	const dba = new GremlinServerAdmin(gremlinServer);
	const {g} = gremlinServer;
	let stop;
	before(async () => {
		const manager = new ContainerManager();
		stop = await serverStart(manager, {HostPort});
		await gremlinServer.connect(-1);

		assert.ok(gremlinServer.connection.isOpen);
	});
	after(async () => {
		await gremlinServer.disconnect();
		assert.ok(!gremlinServer.connection.isOpen);
		await stop();
	});
	it('(connect)', async () => {
		await gremlinServer.connect();
		await gremlinServer.disconnect();
		assert.ok(!gremlinServer.connection.isOpen);
	});
	it('reconnect', async () => {
		await gremlinServer.connect();
		await gremlinServer.disconnect();
		await gremlinServer.connect();
		await gremlinServer.disconnect();
	});
	it('sample', async () => {

		await dba.clear();

		console.debug(await query(g.E().count()));
		const [v1] = await query(g.addV('person').property('name', 'Alice').property('age', 30));
		const [v2] = await query(g.addV('person').property('name', 'Bob').property('age', 35));
		console.debug('get by id', await gremlinServer.getV(v1.id));

		console.debug(await query(g.V().hasLabel('person').values()));

		await query(g.V(v1).addE('knows').to(v2));


		console.debug(await query(g.E().count()));
		console.debug(await gremlinServer.getV(0));
	});

});