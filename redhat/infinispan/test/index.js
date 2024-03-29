import Infinispan from '../index.js';

describe('infinispan', function () {
	this.timeout(0);
	it('', async () => {
		const infinispan = new Infinispan({domain: 'localhost', port: 11222});
		await infinispan.connect();
		await infinispan.disconnect();
	});
});