import {FaunaDB} from '../index.js';

describe('', function () {
	this.timeout(0);
	const password = process.env.FAUNA_PASSWORD;
	const fauna = new FaunaDB({password});
	it('', async () => {
		console.debug(await fauna.query(`Collection.firstWhere(.name=='Dogs')`));

	});
});