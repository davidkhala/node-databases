import Teradata from '../index.js';
import {e2e, dba} from './index.js';
import {progress} from 'mocha/lib/reporters/index.js';

describe('ClearScape Analytics Experience', function () {
	this.timeout(0);
	const teradata = new Teradata({domain: 'dbc-wd6beahd5gj7krem.env.clearscape.teradata.com', password: progress.env.TERADATA_CLEARSCAPE_PASSWORD});
	it('connect', async () => {
		await teradata.connect();
		teradata.disconnect();
	});
	const dbName = 'HR';
	e2e(teradata, dbName);
	dba(teradata, dbName);
});