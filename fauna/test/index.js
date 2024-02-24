import {FaunaDB} from '../index.js';
import assert from 'assert';
import {fql} from 'fauna';

describe('', function () {
	this.timeout(0);
	const password = process.env.FAUNA_PASSWORD;
	const fauna = new FaunaDB({password});
	const resultAssert = (namedDocument) => {
		const {coll, name} = namedDocument;
		assert.equal(coll.name, 'Collection');
		assert.equal(name, 'Dogs');
	};
	it('wrapped query', async () => {
		const namedDocument = await fauna.query(`Collection.firstWhere(.name=='Dogs')`);
		resultAssert(namedDocument);
	});
	it('native query', async () => {
		const q = fql`Collection.firstWhere(.name=='Dogs')`;
		const {data} = await fauna.connection.query(q);
		resultAssert(data);
	});
	after(() => {
		fauna.disconnect();
	});
});