import {Cosmos, CosmosEdge, CosmosVertex} from '../cosmos.js';
import {drop} from '../query.js';
import assert from 'assert';

describe('cosmos', function () {
	this.timeout(0);
	const config = {
		database: 'graphdb',
		graph: 'Persons',
		username: 'tinkerpop',
		password: process.env.COSMOS_GREMLIN_PASSWORD
	};
	const cosmos = new Cosmos(config);
	beforeEach(async () => {
		await cosmos.connect();
	});
	afterEach(async () => {
		await cosmos.disconnect();
	});
	it('id-less vertex', async () => {
		const anonymous = new CosmosVertex('person');
		await cosmos.query(anonymous.create({}, '0'));
	});
	it('azure-cosmos-db-graph-nodejs-getting-started', async () => {


		await cosmos.query(drop);
		const nodeSource = new CosmosVertex('person', 'thomas');
		const nodeTarget = new CosmosVertex('person', 'mary');

		const edgeId = 5;
		const edgeKnows = new CosmosEdge('knows', 5);
		await cosmos.query(nodeSource.create({
			firstName: 'Thomas',
			age: 44, userid: 1
		}));
		await cosmos.query(nodeTarget.create({
			firstName: 'Mary',
			lastName: 'Andersen',
			age: 39,
			userid: 2
		}));
		assert.equal((await cosmos.queryOne(edgeKnows.create(nodeSource, nodeTarget))).id, edgeId);

		assert.ok((await cosmos.query(nodeSource.list())).map(({id}) => id).includes('thomas'));
	});
});