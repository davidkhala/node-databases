import LevelDB from '../index.js';

import path from 'path';
import {consoleLogger} from 'khala-logger/log4js.js';

const logger = consoleLogger('test:leveldb');
import {fileURLToPath} from 'url';

if (!global.__dirname) {
	const __filename = fileURLToPath(import.meta.url);
	global.__dirname = path.dirname(__filename);
}
describe('Leveldb reader', () => {

	it('histroy', async () => {
		const histroy = path.resolve(__dirname, 'fixtures/ledgersData/historyLeveldb');
		const levelconn = new LevelDB(histroy);
		await levelconn.connect();
		const aValue = await levelconn.list();
		logger.info(aValue);
	});
	it('index', async () => {
		const index = path.resolve(__dirname, 'fixtures/ledgersData/chains/index');
		const levelconn = new LevelDB(index);
		await levelconn.connect();
		const aValue = await levelconn.list();
		logger.info(aValue);
	});

});
